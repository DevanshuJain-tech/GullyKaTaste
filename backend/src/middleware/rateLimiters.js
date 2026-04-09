import rateLimit from "express-rate-limit";

export function createUserWriteLimiter({ windowMs, limit }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (req) => String(req.currentUser?.id ?? req.ip),
    message: { error: "Too many write requests. Please retry shortly." },
  });
}

