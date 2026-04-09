import * as yup from "yup";

export const createReelSchema = yup.object({
  vendor_id: yup.number().integer().positive().nullable().optional(),
  video_url: yup.string().url().required(),
  thumbnail_url: yup.string().url().nullable().optional(),
  description: yup.string().trim().max(2000).nullable().optional(),
});

export const createReelCommentSchema = yup.object({
  comment: yup.string().trim().min(1).max(1000).required(),
});

