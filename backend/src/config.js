import dotenv from "dotenv";

dotenv.config();

const requiredVars = [
  "DATABASE_URL",
  "PRISMA_DATABASE_URL",
  "AUTH0_AUDIENCE",
  "AUTH0_ISSUER_BASE_URL",
];

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
  : [];

const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: (process.env.NODE_ENV ?? "development") === "production",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL,
  prismaDatabaseUrl: process.env.PRISMA_DATABASE_URL,
  auth0Domain: process.env.AUTH0_DOMAIN,
  auth0Audience: process.env.AUTH0_AUDIENCE,
  auth0IssuerBaseUrl: issuerBaseUrl,
  auth0Issuer: issuerBaseUrl.endsWith("/") ? issuerBaseUrl : `${issuerBaseUrl}/`,
  corsOrigins,
  cloudinaryCloudName:
    process.env.CLOUDINARY_CLOUD_NAME ?? process.env.CLOUDINARY_NAME,
  cloudinaryUploadPreset:
    process.env.CLOUDINARY_UPLOAD_PRESET ?? process.env.CLOUDINARY_PRESET,
  cloudinaryApiKey:
    process.env.CLOUDINARY_API_KEY ?? process.env.CLOUDINARY_KEY,
  cloudinaryApiSecret:
    process.env.CLOUDINARY_API_SECRET ?? process.env.CLOUDINARY_SECRET,
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER,
};