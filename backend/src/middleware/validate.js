import { HttpError } from "../errors.js";

export function validate(schema, target = "body") {
  return async (req, _res, next) => {
    try {
      const value = await schema.validate(req[target] ?? {}, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.validated = req.validated ?? {};
      req.validated[target] = value;
      next();
    } catch (error) {
      if (error?.name === "ValidationError") {
        throw new HttpError(400, "Validation failed", {
          errors: error.errors ?? [],
        });
      }
      next(error);
    }
  };
}

