import mongoose, { Schema } from "mongoose";

const jobApplicationSchema = new Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  date: {
    type: Number,
    required: true,
  },
});

export const JobApplication = mongoose.model(
  "JobApplication",
  jobApplicationSchema,
);
