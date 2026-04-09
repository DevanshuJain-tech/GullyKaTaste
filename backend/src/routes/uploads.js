import { Router } from "express";
import crypto from "node:crypto";
import * as yup from "yup";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { config } from "../config.js";
import { HttpError } from "../errors.js";
import { validateOrThrow } from "../validation/validateOrThrow.js";

export const uploadsRouter = Router();

const signUploadSchema = yup.object({
  resource_type: yup
    .string()
    .oneOf(["image", "video", "raw", "auto"])
    .default("image"),
});

uploadsRouter.post(
  "/uploads/sign",
  asyncHandler(async (req, res) => {
    const parsed = await validateOrThrow(signUploadSchema, req.body);

    if (!config.cloudinaryCloudName || !config.cloudinaryUploadPreset) {
      throw new HttpError(
        503,
        "Upload provider is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET.",
      );
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/${parsed.resource_type}/upload`;

    return res.json({
      data: {
        provider: "cloudinary",
        upload_url: uploadUrl,
        fields: (() => {
          const baseFields = {
            upload_preset: config.cloudinaryUploadPreset,
            ...(config.cloudinaryFolder ? { folder: config.cloudinaryFolder } : {}),
          };

          // If API key/secret are configured, return signed upload params.
          if (config.cloudinaryApiKey && config.cloudinaryApiSecret) {
            const timestamp = Math.floor(Date.now() / 1000);
            const toSign = {
              ...baseFields,
              timestamp,
            };

            const signaturePayload = Object.keys(toSign)
              .sort()
              .map((key) => `${key}=${toSign[key]}`)
              .join("&");

            const signature = crypto
              .createHash("sha1")
              .update(`${signaturePayload}${config.cloudinaryApiSecret}`)
              .digest("hex");

            return {
              ...baseFields,
              api_key: config.cloudinaryApiKey,
              timestamp: String(timestamp),
              signature,
            };
          }

          return baseFields;
        })(),
      },
    });
  }),
);