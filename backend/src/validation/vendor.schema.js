import * as yup from "yup";

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const vendorFiltersSchema = yup.object({
  page: yup.number().integer().positive().optional(),
  pageSize: yup.number().integer().positive().max(50).optional(),
  veg: yup.string().oneOf(["true", "false"]).optional(),
  foodType: yup.string().trim().min(1).max(60).optional(),
  query: yup.string().trim().min(1).max(120).optional(),
  openNow: yup.string().oneOf(["true", "false"]).optional(),
  lat: yup.number().min(-90).max(90).optional(),
  lng: yup.number().min(-180).max(180).optional(),
  radiusKm: yup.number().positive().max(50).optional(),
});

const menuItemSchema = yup.object({
  name: yup.string().trim().min(1).max(120).required(),
  price: yup.number().positive().max(100000).required(),
  is_veg: yup.boolean().default(true),
  available: yup.boolean().default(true),
});

const photoSchema = yup.object({
  url: yup.string().url().required(),
  sort_order: yup.number().integer().min(0).optional(),
});

const locationSchema = yup.object({
  address_text: yup.string().trim().min(1).max(500).required(),
  lat: yup.number().min(-90).max(90).optional(),
  lng: yup.number().min(-180).max(180).optional(),
});

export const onboardingSchema = yup.object({
  stall_name: yup.string().trim().min(2).max(120).required(),
  description: yup.string().trim().max(1000).nullable().optional(),
  food_types: yup.array().of(yup.string().trim().min(1).max(60)).max(20).default([]),
  phone: yup.string().trim().max(30).nullable().optional(),
  open_time: yup.string().matches(TIME_REGEX).nullable().optional(),
  close_time: yup.string().matches(TIME_REGEX).nullable().optional(),
  location: locationSchema.nullable().optional(),
  photos: yup.array().of(photoSchema).max(20).default([]),
  menu_items: yup.array().of(menuItemSchema).max(100).default([]),
});

export const patchVendorSchema = yup
  .object({
    stall_name: yup.string().trim().min(2).max(120).optional(),
    description: yup.string().trim().max(1000).nullable().optional(),
    food_types: yup.array().of(yup.string().trim().min(1).max(60)).max(20).optional(),
    phone: yup.string().trim().max(30).nullable().optional(),
    open_time: yup.string().matches(TIME_REGEX).nullable().optional(),
    close_time: yup.string().matches(TIME_REGEX).nullable().optional(),
    status: yup.string().oneOf(["draft", "submitted"]).optional(),
    location: locationSchema.nullable().optional(),
    photos: yup.array().of(photoSchema).max(20).optional(),
    menu_items: yup.array().of(menuItemSchema).max(100).optional(),
  })
  .test("at-least-one", "At least one field is required", (value) => {
    if (!value) return false;
    return Object.keys(value).length > 0;
  });

