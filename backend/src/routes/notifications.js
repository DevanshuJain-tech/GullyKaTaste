import { Router } from "express";
import * as yup from "yup";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../errors.js";
import { buildPagination, parsePagination } from "../utils/pagination.js";
import { validateOrThrow } from "../validation/validateOrThrow.js";

export const notificationsRouter = Router();

function mapNotification(row) {
  return {
    id: String(row.id),
    type: row.type,
    title: row.title,
    message: row.message,
    read_at: row.read_at,
    created_at: row.created_at,
    is_read: Boolean(row.read_at),
  };
}

notificationsRouter.get(
  "/notifications",
  asyncHandler(async (req, res) => {
    const schema = yup.object({
      unreadOnly: yup.string().oneOf(["true", "false"]).optional(),
      page: yup.number().integer().positive().optional(),
      pageSize: yup.number().integer().positive().optional(),
    });

    const parsed = await validateOrThrow(schema, req.query);

    const pagination = parsePagination(parsed, { maxPageSize: 50 });

    const unreadOnly = parsed.unreadOnly === "true";
    const where = {
      userId: req.currentUser.id,
      ...(unreadOnly ? { readAt: null } : {}),
    };

    const [total, notifications] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.offset,
        take: pagination.pageSize,
      }),
    ]);

    return res.json({
      data: notifications.map((n) =>
        mapNotification({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          read_at: n.readAt,
          created_at: n.createdAt,
        }),
      ),
      pagination: buildPagination(
        total,
        pagination.page,
        pagination.pageSize,
      ),
    });
  }),
);

notificationsRouter.post(
  "/notifications/:id/read",
  asyncHandler(async (req, res) => {
    const notificationId = Number(req.params.id);
    if (!Number.isInteger(notificationId) || notificationId <= 0) {
      throw new HttpError(400, "Invalid notification id");
    }

    const existing = await prisma.notification.findFirst({
      where: { id: notificationId, userId: req.currentUser.id },
    });
    if (!existing) {
      throw new HttpError(404, "Notification not found");
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: existing.readAt ?? new Date() },
    });

    return res.json({
      data: mapNotification({
        id: updated.id,
        type: updated.type,
        title: updated.title,
        message: updated.message,
        read_at: updated.readAt,
        created_at: updated.createdAt,
      }),
    });
  }),
);