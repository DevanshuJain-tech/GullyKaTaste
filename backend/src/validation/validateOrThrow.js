import { HttpError } from "../errors.js";

export async function validateOrThrow(schema, data) {
  try {
    return await schema.validate(data ?? {}, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      throw new HttpError(400, "Validation failed", {
        errors: error.errors ?? [],
      });
    }
    throw error;
  }
}

