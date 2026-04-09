import * as yup from "yup";

export const patchMeSchema = yup
  .object({
    full_name: yup.string().trim().min(1).max(120).optional(),
    phone: yup.string().trim().min(7).max(30).optional(),
  })
  .test("at-least-one", "At least one field is required", (value) => {
    if (!value) return false;
    return value.full_name !== undefined || value.phone !== undefined;
  });

