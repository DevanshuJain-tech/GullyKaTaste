import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../errors.js";
import { buildPagination, parsePagination } from "../utils/pagination.js";
import { createPostCommentSchema, createPostSchema } from "../validation/post.schema.js";
import { validateOrThrow } from "../validation/validateOrThrow.js";

export const postsRouter = Router();

function mapPostRow(row, media, commentsCount) {
  return {
    id: String(row.id),
    content: row.content,
    location_text: row.locationText,
    lat: row.lat,
    lng: row.lng,
    created_at: row.createdAt,
    user: {
      name: row.user?.fullName || row.user?.email || `User ${row.user?.id ?? "unknown"}`,
      avatar: row.user?.picture ?? null,
    },
    media:
      media?.map((item) => ({
        id: String(item.id),
        url: item.url,
        type: item.type,
      })) ?? [],
    comments_count: commentsCount ?? 0,
    likes_count: 0,
  };
}

function mapPostCommentRow(row) {
  return {
    id: String(row.id),
    post_id: String(row.postId),
    comment: row.comment,
    created_at: row.createdAt,
    user: {
      name: row.user?.fullName || row.user?.email || `User ${row.user?.id ?? "unknown"}`,
      avatar: row.user?.picture ?? null,
    },
  };
}

postsRouter.get(
  "/posts",
  asyncHandler(async (req, res) => {
    const pagination = parsePagination(req.query ?? {}, { maxPageSize: 50 });

    const [total, posts] = await Promise.all([
      prisma.post.count(),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        skip: pagination.offset,
        take: pagination.pageSize,
        include: {
          user: true,
          media: { orderBy: { id: "asc" } },
          _count: { select: { comments: true } },
        },
      }),
    ]);

    return res.json({
      data: posts.map((post) => mapPostRow(post, post.media, post._count.comments)),
      pagination: buildPagination(
        total,
        pagination.page,
        pagination.pageSize,
      ),
    });
  }),
);

postsRouter.post(
  "/posts",
  asyncHandler(async (req, res) => {
    const payload = await validateOrThrow(createPostSchema, req.body);

    const post = await prisma.post.create({
      data: {
        userId: req.currentUser.id,
        content: payload.content,
        locationText: payload.location_text ?? null,
        lat: payload.lat ?? null,
        lng: payload.lng ?? null,
        media: payload.media?.length
          ? {
              createMany: {
                data: payload.media.map((m) => ({ url: m.url, type: m.type })),
              },
            }
          : undefined,
      },
      include: {
        user: true,
        media: { orderBy: { id: "asc" } },
      },
    });

    return res.status(201).json({ data: mapPostRow(post, post.media, 0) });
  }),
);

postsRouter.get(
  "/posts/:id/comments",
  asyncHandler(async (req, res) => {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId <= 0) {
      throw new HttpError(400, "Invalid post id");
    }

    const pagination = parsePagination(req.query ?? {}, { maxPageSize: 100 });

    const [total, comments] = await Promise.all([
      prisma.postComment.count({ where: { postId } }),
      prisma.postComment.findMany({
        where: { postId },
        orderBy: { createdAt: "desc" },
        skip: pagination.offset,
        take: pagination.pageSize,
        include: { user: true },
      }),
    ]);

    return res.json({
      data: comments.map(mapPostCommentRow),
      pagination: buildPagination(
        total,
        pagination.page,
        pagination.pageSize,
      ),
    });
  }),
);

postsRouter.post(
  "/posts/:id/comments",
  asyncHandler(async (req, res) => {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId <= 0) {
      throw new HttpError(400, "Invalid post id");
    }

    const payload = await validateOrThrow(createPostCommentSchema, req.body);

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    const created = await prisma.postComment.create({
      data: {
        postId,
        userId: req.currentUser.id,
        comment: payload.comment,
      },
      include: { user: true },
    });

    return res.status(201).json({ data: mapPostCommentRow(created) });
  }),
);