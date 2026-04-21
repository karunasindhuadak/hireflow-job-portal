import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Company } from "../models/company.model.js";

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
          refreshToken
        },
        "Company registered successfully",
      )
    )
});

// Company login
const loginCompany = asyncHandler(async (req, res) => {});

// Get company data
const getCompanyData = asyncHandler(async (req, res) => {});

// Post a new job
const postJob = asyncHandler(async (req, res) => {});

// Get company job applicants
const getCompanyJobApplicants = asyncHandler(async (req, res) => {});

// Get company posted jobs
const getCompanyPostedJobs = asyncHandler(async (req, res) => {});

// Change job application status
const changeJobApplicationStatus = asyncHandler(async (req, res) => {});

// Change job visibility
const changeJobVisibility = asyncHandler(async (req, res) => {});

export {
  registerCompany,
  loginCompany,
  getCompanyData,
  postJob,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  changeJobApplicationStatus,
  changeJobVisibility,
};
