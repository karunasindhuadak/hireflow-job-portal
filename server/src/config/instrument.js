import "dotenv/config";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [Sentry.mongooseIntegration()],

  // Set the sample rate for performance monitoring (1.0 = 100% of transactions)
  tracesSampleRate: 1.0,

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
