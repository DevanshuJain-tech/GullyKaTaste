import { Router } from "express";
import * as yup from "yup";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../errors.js";
import { buildPagination, parsePagination } from "../utils/pagination.js";
import { createUserWriteLimiter } from "../middleware/rateLimiters.js";
import { validateOrThrow } from "../validation/validateOrThrow.js";

export const reviewsRouter = Router();
const reviewWriteLimiter = createUserWriteLimiter({ windowMs: 60 * 1000, limit: 20 });

const createReviewSchema = yup.object({
  rating: yup.number().integer().min(1).max(5).required(),
  comment: yup.string().trim().max(1000).nullable().optional(),
});

const patchReviewSchema = yup
  .object({
    rating: yup.number().integer().min(1).max(5).optional(),
    comment: yup.string().trim().max(1000).nullable().optional(),
  })
  .test("at-least-one", "At least one field is required", (data) => {
    if (!data) return false;
    return data.rating !== undefined || data.comment !== undefined;
  });

function mapReviewRow(row) {
  return {
    id: String(row.id),
    vendorId: row.vendorId !== undefined ? String(row.vendorId) : undefined,
    vendorName: row.vendor?.stallName,
    rating: row.rating,
    comment: row.comment,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
    user: {
      name: row.user?.fullName || row.user?.email || `User ${row.user?.id ?? "unknown"}`,
      avatar: row.user?.picture ?? null,
    },
  };
}

reviewsRouter.get(
  "/vendors/:id/reviews",
  asyncHandler(async (req, res) => {
    const vendorId = Number(req.params.id);
    if (!Number.isInteger(vendorId) || vendorId <= 0) {
      throw new HttpError(400, "Invalid vendor id");
    }

    const pagination = parsePagination(req.query ?? {}, { maxPageSize: 50 });

    const [total, reviews] = await Promise.all([
      prisma.review.count({ where: { vendorId } }),
      prisma.review.findMany({
        where: { vendorId },
        orderBy: { createdAt: "desc" },
        skip: pagination.offset,
        take: pagination.pageSize,
        include: { user: true },
      }),
    ]);

    return res.json({
      data: reviews.map(mapReviewRow),
      pagination: buildPagination(
        total,
        pagination.page,
        pagination.pageSize,
      ),
    });
  }),
);

reviewsRouter.get(
  "/reviews",
  asyncHandler(async (req, res) => {
    const schema = yup.object({
      user: yup.string().oneOf(["me"]).optional(),
      vendorId: yup.number().integer().positive().optional(),
      page: yup.number().integer().positive().optional(),
      pageSize: yup.number().integer().positive().optional(),
    });

    const parsed = await validateOrThrow(schema, req.query);

    const pagination = parsePagination(parsed, { maxPageSize: 50 });
    const where = {
      ...(parsed.user === "me" ? { userId: req.currentUser.id } : {}),
      ...(parsed.vendorId ? { vendorId: Number(parsed.vendorId) } : {}),
    };

    const [total, list] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        include: { user: true, vendor: true },
        orderBy: { createdAt: "desc" },
        skip: pagination.offset,
        take: pagination.pageSize,
      }),
    ]);

    return res.json({
      data: list.map(mapReviewRow),
      pagination: buildPagination(
        total,
        pagination.page,
        pagination.pageSize,
      ),
    });
  }),
);

reviewsRouter.post(
  "/vendors/:id/reviews",
  reviewWriteLimiter,
  asyncHandler(async (req, res) => {
    const vendorId = Number(req.params.id);
    if (!Number.isInteger(vendorId) || vendorId <= 0) {
      throw new HttpError(400, "Invalid vendor id");
    }

    const payload = await validateOrThrow(createReviewSchema, req.body);

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { id: true, ownerUserId: true, stallName: true },
    });

    if (!vendor) {
      throw new HttpError(404, "Vendor not found");
    }

    const existing = await prisma.review.findFirst({
      where: { vendorId, userId: req.currentUser.id },
      select: { id: true },
    });

    const review = existing
      ? await prisma.review.update({
          where: { id: existing.id },
          data: { rating: payload.rating, comment: payload.comment ?? null, updatedAt: new Date() },
        })
      : await prisma.review.create({
          data: {
            userId: req.currentUser.id,
            vendorId,
            rating: payload.rating,
            comment: payload.comment ?? null,
          },
        });

    if (vendor.ownerUserId !== req.currentUser.id) {
      await prisma.notification.create({
        data: {
          userId: vendor.ownerUserId,
          type: "new_review",
          title: "New review received",
          message: `You received a new review for ${vendor.stallName}.`,
        },
      });
    }

    return res.status(201).json({
      data: {
        id: String(review.id),
        vendorId: String(review.vendorId),
        rating: review.rating,
        comment: review.comment,
        created_at: review.createdAt,
        updated_at: review.updatedAt,
      },
    });
  }),
);

reviewsRouter.patch(
  "/reviews/:id",
  reviewWriteLimiter,
  asyncHandler(async (req, res) => {
    const reviewId = Number(req.params.id);
    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      throw new HttpError(400, "Invalid review id");
    }

    const payload = await validateOrThrow(patchReviewSchema, req.body);

    const existing = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true },
    });

    if (!existing) {
      throw new HttpError(404, "Review not found");
    }
    const canEdit = existing.userId === req.currentUser.id;

    if (!canEdit) {
      throw new HttpError(403, "Only the review owner can edit this review");
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(payload.rating !== undefined ? { rating: payload.rating } : {}),
        ...(payload.comment !== undefined ? { comment: payload.comment ?? null } : {}),
        updatedAt: new Date(),
      },
    });

    return res.json({
      data: {
        id: String(review.id),
        vendorId: String(review.vendorId),
        rating: review.rating,
        comment: review.comment,
        created_at: review.createdAt,
        updated_at: review.updatedAt,
      },
    });
  }),
);

reviewsRouter.delete(
  "/reviews/:id",
  reviewWriteLimiter,
  asyncHandler(async (req, res) => {
    const reviewId = Number(req.params.id);
    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      throw new HttpError(400, "Invalid review id");
    }

    const existing = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true },
    });

    if (!existing) {
      throw new HttpError(404, "Review not found");
    }
    const canDelete =
      existing.userId === req.currentUser.id || req.currentUser.role === "admin";

    if (!canDelete) {
      throw new HttpError(403, "Not authorized to delete this review");
    }

    await prisma.review.delete({ where: { id: reviewId } });

    return res.json({ data: { id: String(reviewId), deleted: true } });
  }),
);