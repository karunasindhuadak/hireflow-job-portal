import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
});

// Index on companyId — speeds up job lookups per company
jobSchema.index({ companyId: 1 });

// Index on visible — speeds up public job listing queries
jobSchema.index({ visible: 1 });

export const Job = mongoose.model("Job", jobSchema);
