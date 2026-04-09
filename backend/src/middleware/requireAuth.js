import { createRemoteJWKSet, jwtVerify } from "jose";
import { config } from "../config.js";

const JWKS = createRemoteJWKSet(new URL(`${config.auth0Issuer}.well-known/jwks.json`));
const acceptedAudiences = [config.auth0Audience, config.auth0ClientId].filter(Boolean);

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      return res.status(401).json({ error: "Missing bearer token" });
    }

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: config.auth0Issuer,
      audience:
        acceptedAudiences.length === 1
          ? acceptedAudiences[0]
          : acceptedAudiences,
    });

    req.auth = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}