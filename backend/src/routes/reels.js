import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../errors.js";
import { buildPagination, parsePagination } from "../utils/pagination.js";
import {
  createReelCommentSchema,
  createReelSchema,
} from "../validation/reel.schema.js";
import { validateOrThrow } from "../validation/validateOrThrow.js";

export const reelsRouter = Router();

function mapReelRow(row) {
  return {
    id: String(row.id),
    vendorId: row.vendorId ? String(row.vendorId) : null,
    vendorName: row.vendor?.stallName ?? "Community Reel",
    user: {
      name: row.user?.fullName || row.user?.email || `User ${row.user?.id ?? "unknown"}`,
      avatar: row.user?.picture ?? null,
    },
    videoUrl: row.videoUrl,
    thumbnailUrl: row.thumbnailUrl,
    description: row.description,
    created_at: row.createdAt,
    comments_count: row._count?.comments ?? 0,
    likes_count: 0,
  };
}

function mapReelCommentRow(row) {
  return {
    id: String(row.id),
    reel_id: String(row.reelId),
    comment: row.comment,
    created_at: row.createdAt,
    user: {
      name: row.user?.fullName || row.user?.email || `User ${row.user?.id ?? "unknown"}`,
      avatar: row.user?.picture ?? null,
    },
  };
}

reelsRouter.get(
  "/reels",
  asyncHandler(async (req, res) => {
    const pagination = parsePagination(req.query ?? {}, { maxPageSize: 50 });

    const [total, reels] = await Promise.all([
      prisma.reel.count(),
      prisma.reel.findMany({
        orderBy: { createdAt: "desc" },
        skip: pagination.offset,
        take: pagination.pageSize,
        include: { user: true, vendor: true, _count: { select: { comments: true } } },
      }),
    ]);

    return res.json({
      data: reels.map(mapReelRow),
      pagination: buildPagination(
        total,
        pagination.page,
        pagination.pageSize,
      ),
    });
  }),
);

reelsRouter.post(
  "/reels",
  asyncHandler(async (req, res) => {
    const payload = await validateOrThrow(createReelSchema, req.body);

    let vendorId = payload.vendor_id ?? null;

    if (vendorId) {
      const vendor = await prisma.vendor.findUnique({
        where: { id: vendorId },
        select: { id: true, ownerUserId: true },
      });

      if (!vendor) {
        throw new HttpError(404, "Vendor not found");
      }

      const ownerId = vendor.ownerUserId;
      const canPublishForVendor =
        ownerId === req.currentUser.id || req.currentUser.role === "admin";

      if (!canPublishForVendor) {
        throw new HttpError(403, "Not authorized to publish reel for this vendor");
      }
    }

    const created = await prisma.reel.create({
      data: {
        vendorId,
        userId: req.currentUser.id,
        videoUrl: payload.video_url,
        thumbnailUrl: payload.thumbnail_url ?? null,
        description: payload.description ?? null,
      },
      include: { user: true, vendor: true, _count: { select: { comments: true } } },
    });

    return res.status(201).json({ data: mapReelRow(created) });
  }),
);

reelsRouter.get(
  "/reels/:id/comments",
  asyncHandler(async (req, res) => {
    const reelId = Number(req.params.id);
    if (!Number.isInteger(reelId) || reelId <= 0) {
      throw new HttpError(400, "Invalid reel id");
    }

    const pagination = parsePagination(req.query ?? {}, { maxPageSize: 100 });

    const [total, comments] = await Promise.all([
      prisma.reelComment.count({ where: { reelId } }),
      prisma.reelComment.findMany({
        where: { reelId },
        orderBy: { createdAt: "desc" },
        skip: pagination.offset,
        take: pagination.pageSize,
        include: { user: true },
      }),
    ]);

    return res.json({
      data: comments.map(mapReelCommentRow),
      pagination: buildPagination(
        total,
        pagination.page,
        pagination.pageSize,
      ),
    });
  }),
);

reelsRouter.post(
  "/reels/:id/comments",
  asyncHandler(async (req, res) => {
    const reelId = Number(req.params.id);
    if (!Number.isInteger(reelId) || reelId <= 0) {
      throw new HttpError(400, "Invalid reel id");
    }

    const payload = await validateOrThrow(createReelCommentSchema, req.body);

    const reel = await prisma.reel.findUnique({ where: { id: reelId }, select: { id: true } });
    if (!reel) {
      throw new HttpError(404, "Reel not found");
    }

    const created = await prisma.reelComment.create({
      data: { reelId, userId: req.currentUser.id, comment: payload.comment },
      include: { user: true },
    });

    return res.status(201).json({ data: mapReelCommentRow(created) });
  }),
);