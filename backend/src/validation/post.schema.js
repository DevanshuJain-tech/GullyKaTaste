import * as yup from "yup";

export const createPostSchema = yup.object({
  content: yup.string().trim().min(1).max(4000).required(),
  location_text: yup.string().trim().max(300).nullable().optional(),
  lat: yup.number().min(-90).max(90).nullable().optional(),
  lng: yup.number().min(-180).max(180).nullable().optional(),
  media: yup
    .array()
    .of(
      yup.object({
        url: yup.string().url().required(),
        type: yup.string().oneOf(["image", "video"]).required(),
      }),
    )
    .max(10)
    .default([]),
});

export const createPostCommentSchema = yup.object({
  comment: yup.string().trim().min(1).max(1000).required(),
});

