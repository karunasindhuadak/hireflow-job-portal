import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";

const generateAccessTokenAndRefreshToken = async (companyId) => {
  try {
    const company = await Company.findById(companyId);
    const accessToken = company.generateAccessToken();
    const refreshToken = company.generateRefreshToken();

    company.refreshToken = refreshToken;
    company.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new ApiError(
      500,
      error.message || "Something went wrong while generating tokens",
    );
  }
};

// Register a new company
const registerCompany = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const imageLocalPath = req.file?.path;
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  if (!imageLocalPath) {
    throw new ApiError(400, "Company image is required");
  }
  const companyExists = await Company.findOne({ email });
  if (companyExists) {
    throw new ApiError(400, "Company is already registered");
  }
  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(500, "Failed to upload company image");
  }
  const company = await Company.create({
    name,
    email,
    password,
    image: image.secure_url,
  });

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(company._id);
  const signupCompany = await Company.findById(company._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          company: signupCompany,
          accessToken,
          refreshToken,
        },
        "Company registered successfully",
      ),
    );
});

// Company login
const loginCompany = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const company = await Company.findOne({ email });
  if (!company) {
    throw new ApiError(400, "Company not found");
  }
  const isPasswordCorrect = await company.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(company._id);
  const loggedInCompany = await Company.findById(company._id).select(
    "-password -refreshToken -__v",
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          company: loggedInCompany,
          accessToken,
          refreshToken,
        },
        "Company logged in successfully",
      ),
    );
});

// logout company
const logoutCompany = asyncHandler(async (req, res) => {
  const companyId = req.company._id;
  await Company.findByIdAndUpdate(
    companyId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "logged out successfully"));
});

// Get company data
const getCompanyData = asyncHandler(async (req, res) => {
  const company = req.company;
  return res
    .status(200)
    .json(new ApiResponse(200, company, "Company data fetched successfully"));
});

// Post a new job
const postJob = asyncHandler(async (req, res) => {
  const { title, description, location, salary, category, level } = req.body;
  if (!title || !description || !location || !salary || !category || !level) {
    throw new ApiError(400, "All fields are required");
  }
  const companyId = req.company._id;
  if (!companyId) {
    throw new ApiError(401, "Unauthorized request");
  }
  const newJob = new Job({
    title,
    description,
    location,
    salary,
    category,
    level,
    date: Date.now(),
    companyId,
  });
  await newJob.save();

  if (!newJob) {
    throw new ApiError(500, "Failed to post job");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { job: newJob }, "Job posted successfully"));
});

// Get company job applicants
const getCompanyJobApplicants = asyncHandler(async (req, res) => {});

// Get company posted jobs
const getCompanyPostedJobs = asyncHandler(async (req, res) => {
  const compId = req.company._id;
  const jobs = await Job.aggregate([
    {
      $match: { companyId: compId },
    },
    {
      $sort: { date: -1 },
    },
    {
      $lookup: {
        from: "jobapplications",
        localField: "_id",
        foreignField: "jobId",
        as: "applications",
      },
    },
    {
      $addFields: {
        applicants: { $size: "$applications" },
      },
    },
    {
      $project: {
        applications: 0,
      },
    },
  ]);

  if (!jobs) {
    throw new ApiError(500, "Failed to fetch company posted jobs");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, jobs, "Company posted jobs fetched successfully"),
    );
});

// Change job application status
const changeJobApplicationStatus = asyncHandler(async (req, res) => {});

// Change job visibility
const changeJobVisibility = asyncHandler(async (req, res) => {
  const { id } = req.body; // job id
  const companyId = req.company._id;

  const job = await Job.findById(id);

  if (companyId.toString() === job.companyId.toString()) {
    job.visible = !job.visible;
  }
  await job.save();

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job visibility updated successfully"));
});

export {
  registerCompany,
  loginCompany,
  logoutCompany,
  getCompanyData,
  postJob,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  changeJobApplicationStatus,
  changeJobVisibility,
};
