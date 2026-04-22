import { Company } from "../models/company.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  const decodedData = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedData) {
    throw new ApiError(401, "Unauthorized request");
  }
  const company = await Company.findById(decodedData._id).select(
    "-password -refreshToken -__v",
  );
  if (!company) {
    throw new ApiError(401, "Unauthorized request");
  }
  req.company = company;
  next();
});
