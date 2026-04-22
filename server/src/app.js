import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.controller.js";

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

// All routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/webhooks", clerkWebhooks);

// Routes import
import companyRouter from "./routes/company.routes.js";
import jobRouter from "./routes/job.routes.js";

// Routes Declaration
app.use("/api/company", companyRouter);
app.use("api/job", jobRouter);

// Sentry error handling middleware should be added after all routes
Sentry.setupExpressErrorHandler(app);

// Fallthrough error handler (after Sentry)
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.json({
    error: "Internal Server Error",
    sentryId: res.sentry,
  });
});

export default app;
