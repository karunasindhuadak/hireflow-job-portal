import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { JobApplication } from "../models/jobApplication.model.js";
import { Job } from "../models/job.model.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getAuth } from "@clerk/express";

// get user data
const getUserData = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  // console.log("Fetching data ", getAuth(req));
  const user = await User.findById(userId).select("-__v");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User data fetched successfully"));
});

// Apply for a job
const applyForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  const { userId } = getAuth(req);

  const isAlreadyApplied = await JobApplication.findOne({ jobId, userId });
  if (isAlreadyApplied) {
    throw new ApiError(400, "You have already applied for this job");
  }
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  await JobApplication.create({
    userId,
    jobId,
    companyId: job.companyId,
    date: Date.now(),
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Job application submitted successfully"));
});

// Get user applied jobs application
const getUserJobApplications = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const applications = await JobApplication.aggregate([
    {
      $match: { userId },
    },
    {
      $sort: { date: -1 },
    },
    {
      $lookup: {
        from: "companies",
        localField: "companyId",
        foreignField: "_id",
        as: "companyId",
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              image: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "jobId",
        pipeline: [
          {
            $project: {
              title: 1,
              description: 1,
              location: 1,
              category: 1,
              level: 1,
              salary: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        companyId: {
          $first: "$companyId",
        },
        jobId: {
          $first: "$jobId",
        },
      },
    },
  ]);
  if (!applications || applications.length === 0) {
    throw new ApiError(404, "No job applications found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        applications,
        "User job applications fetched successfully",
      ),
    );
});

// Update user profile (resume)
const updateUserResume = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const resumeLocalPath = req.file?.path;
  if (!resumeLocalPath) {
    throw new ApiError(400, "Resume file is required");
  }
  const resume = await uploadOnCloudinary(resumeLocalPath, "raw");
  if (!resume || !resume.secure_url) {
    throw new ApiError(500, "Failed to upload resume");
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      resume: resume.secure_url,
    },
    { new: true },
  ).select("-__v");
  if (!updatedUser) {
    throw new ApiError(500, "Failed to update resume");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User resume updated successfully"),
    );
});

export { getUserData, applyForJob, getUserJobApplications, updateUserResume };
