import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "req.headers.x-api-key",
    "req.headers.x-auth-token",
    "req.body.password",
    "req.body.token",
    "req.body.access_token",
    "req.body.refresh_token",
  ],
});