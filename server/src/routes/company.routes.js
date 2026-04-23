import { Router } from "express";
import {
  changeJobApplicationStatus,
  changeJobVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  logoutCompany,
  postJob,
  registerCompany,
} from "../controllers/company.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const companyRouter = Router();

// Register a new company
companyRouter.post("/register", upload.single("image"), registerCompany);

// Company login
companyRouter.post("/login", loginCompany);

// Company logout
companyRouter.post("/logout", verifyJWT, logoutCompany);

// Get company data
companyRouter.get("/company-data", verifyJWT, getCompanyData);

// Post a job
companyRouter.post("/post-job", verifyJWT, postJob);

// Get applicants data of company
companyRouter.get("/applicants", verifyJWT, getCompanyJobApplicants);

// Get company job list
companyRouter.get("/list-jobs", verifyJWT, getCompanyPostedJobs);

// Change Applications Status
companyRouter.post("/change-status", verifyJWT, changeJobApplicationStatus);

// Change Application Visibility
companyRouter.post("/change-visibility", verifyJWT, changeJobVisibility);

export default companyRouter;
