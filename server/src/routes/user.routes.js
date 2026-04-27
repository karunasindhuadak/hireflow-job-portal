import { Router } from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { requireAuth } from "@clerk/express";

const userRouter = Router();

// Get user data
userRouter.get("/user", getUserData);

// Apply for a job
userRouter.post("/apply", applyForJob);

// Get user applied jobs application
userRouter.get("/applications", getUserJobApplications);

// Update user profile (resume)
userRouter.post("/update-resume", upload.single("resume"), updateUserResume);

export default userRouter;
