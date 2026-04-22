import { Job } from "../models/job.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Get all jobs
const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.aggregate([
    {
      $match: { visible: true },
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
              password: 0,
              refreshToken: 0,
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
      },
    },
  ]);

  if (!jobs || jobs.length === 0) {
    throw new ApiError(404, "No jobs found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

// Get a single job by ID
const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid job ID");
  }
  const job = await Job.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
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
              password: 0,
              refreshToken: 0,
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
      },
    },
  ]);
  if (!job || job.length === 0) {
    throw new ApiError(404, "Job not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, job[0], "Job fetched successfully"));
});

export { getAllJobs, getJobById };
