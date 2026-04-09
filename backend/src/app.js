import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { logger } from "./logger.js";
import { isHttpError } from "./errors.js";
import { prisma } from "./prisma/client.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { attachCurrentUser } from "./middleware/attachCurrentUser.js";

export function createApp({ routes, corsOrigins = [] }) {
  const app = express();

  app.disable("x-powered-by");

  app.use(helmet());
  app.use(
    cors({
      origin:
        corsOrigins.length > 0
          ? corsOrigins
          : (origin, callback) => callback(null, origin ?? true),
      credentials: true,
    }),
  );

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    }),
  );

  app.use(express.json({ limit: "2mb" }));

  app.use(
    pinoHttp({
      logger,
      genReqId: (req, _res) => req.headers["x-request-id"] ?? crypto.randomUUID(),
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
    }),
  );

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/ready", async (_req, res, next) => {
    try {
      await prisma.user.findFirst({ select: { id: true } });
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api/v1", requireAuth, attachCurrentUser, routes);

  app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  app.use((error, _req, res, _next) => {
    if (isHttpError(error)) {
      return res.status(error.status).json({
        error: error.message,
        details: error.details,
      });
    }

    logger.error({ err: error }, "Unhandled error");
    return res.status(500).json({ error: "Internal server error" });
  });

  return app;
}