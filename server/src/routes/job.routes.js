import { Router } from "express";
import { getAllJobs, getJobById } from "../controllers/job.controller.js";

const jobRouter = Router();

// Route to get all jobs data
jobRouter.get("/", getAllJobs);

// Route to get single job by ID
jobRouter.get("/:id", getJobById);

export default jobRouter;
