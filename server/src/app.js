import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.controller.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

// Middleware Setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(json());
app.use(cookieParser());
app.use(clerkMiddleware());

// All routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/webhooks", clerkWebhooks);

// Routes import
import companyRouter from "./routes/company.routes.js";
import jobRouter from "./routes/job.routes.js";
import userRouter from "./routes/user.routes.js";

// Routes Declaration
app.use("/api/company", companyRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/users", userRouter);

// Sentry error handling middleware should be added after all routes
Sentry.setupExpressErrorHandler(app);

// Fallthrough error handler (after Sentry)
app.use(function onError(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(res.sentry && { sentryId: res.sentry }),
  });
});

export default app;
