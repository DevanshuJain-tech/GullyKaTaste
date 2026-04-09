import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { prisma } from "../prisma/client.js";
import { patchMeSchema } from "../validation/user.schema.js";
import { validateOrThrow } from "../validation/validateOrThrow.js";

export const meRouter = Router();

meRouter.get(
  "/me",
  asyncHandler(async (req, res) => {
    const [vendor, favoritesCount, reviewsCount] = await Promise.all([
      prisma.vendor.findUnique({
        where: { ownerUserId: req.currentUser.id },
        select: { id: true, stallName: true, status: true, createdAt: true, updatedAt: true },
      }),
      prisma.favorite.count({ where: { userId: req.currentUser.id } }),
      prisma.review.count({ where: { userId: req.currentUser.id } }),
    ]);

    return res.json({
      data: {
        user: req.currentUser,
        vendor: vendor
          ? {
              id: String(vendor.id),
              stall_name: vendor.stallName,
              status: vendor.status,
              created_at: vendor.createdAt,
              updated_at: vendor.updatedAt,
            }
          : null,
        stats: {
          favorites_count: favoritesCount,
          reviews_count: reviewsCount,
        },
      },
    });
  }),
);

meRouter.patch(
  "/me",
  asyncHandler(async (req, res) => {
    const payload = await validateOrThrow(patchMeSchema, req.body);

    const user = await prisma.user.update({
      where: { id: req.currentUser.id },
      data: {
        ...(payload.full_name !== undefined ? { fullName: payload.full_name } : {}),
        ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
        updatedAt: new Date(),
      },
    });

    return res.json({
      data: {
        user: {
          id: user.id,
          auth0_sub: user.auth0Sub,
          email: user.email,
          full_name: user.fullName,
          picture: user.picture,
          phone: user.phone,
          role: user.role,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      },
    });
  }),
);