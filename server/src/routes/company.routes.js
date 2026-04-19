import { Router } from "express";
import {
  changeJobApplicationStatus,
  changeJobVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} from "../controllers/company.controller.js";

const companyRouter = Router();

// Register a new company
companyRouter.post("/register", registerCompany);

// Company login
companyRouter.post("/login", loginCompany);

// Get company data
companyRouter.get("/company", getCompanyData);

// Post a job
companyRouter.post("/post-job", postJob);

// Get applicants data of company
companyRouter.get("/applicants", getCompanyJobApplicants);

// Get company job list
companyRouter.get("/list-jobs", getCompanyPostedJobs);

// Change Applications Status
companyRouter.post("/change-status", changeJobApplicationStatus);

// Change Application Visibility
companyRouter.post("/change-visibility", changeJobVisibility);
