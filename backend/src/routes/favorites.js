import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { buildPagination, parsePagination } from "../utils/pagination.js";
import { HttpError } from "../errors.js";
import { prisma } from "../prisma/client.js";

export const favoritesRouter = Router();

function mapFavoriteVendor(vendor) {
  const rating =
    vendor.reviews.length > 0
      ? vendor.reviews.reduce((sum, r) => sum + r.rating, 0) / vendor.reviews.length
      : 0;
  const isOpen =
    !vendor.openTime || !vendor.closeTime
      ? true
      : new Date(`1970-01-01T${vendor.openTime}:00`) <= new Date(`1970-01-01T${vendor.closeTime}:00`);

  return {
    id: String(vendor.id),
    name: vendor.stallName,
    image: vendor.photos[0]?.url ?? null,
    distance: null,
    rating: Number(rating.toFixed(2)),
    reviewCount: vendor.reviews.length,
    isVeg: vendor.menuItems.every((m) => m.isVeg),
    tags: vendor.foodTypes,
    isOpen,
    latitude: vendor.location?.lat ?? null,
    longitude: vendor.location?.lng ?? null,
    phone: vendor.phone,
    hours: vendor.openTime && vendor.closeTime ? `${vendor.openTime} - ${vendor.closeTime}` : null,
    status: vendor.status,
    isFavorite: true,
  };
}

favoritesRouter.get(
  "/favorites",
  asyncHandler(async (req, res) => {
    const pagination = parsePagination(req.query ?? {}, { maxPageSize: 50 });

    const [total, list] = await Promise.all([
      prisma.favorite.count({ where: { userId: req.currentUser.id } }),
      prisma.favorite.findMany({
        where: { userId: req.currentUser.id },
        orderBy: { createdAt: "desc" },
        skip: pagination.offset,
        take: pagination.pageSize,
        include: {
          vendor: {
            include: {
              location: true,
              photos: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
              menuItems: true,
              reviews: { select: { rating: true } },
            },
          },
        },
      }),
    ]);

    return res.json({
      data: list.map((item) => mapFavoriteVendor(item.vendor)),
      pagination: buildPagination(
        total,
        pagination.page,
        pagination.pageSize,
      ),
    });
  }),
);

favoritesRouter.post(
  "/favorites/:vendorId",
  asyncHandler(async (req, res) => {
    const vendorId = Number(req.params.vendorId);
    if (!Number.isInteger(vendorId) || vendorId <= 0) {
      throw new HttpError(400, "Invalid vendor id");
    }

    const vendor = await prisma.vendor.findFirst({
      where: { id: vendorId, status: { in: ["submitted", "approved"] } },
      select: { id: true },
    });

    if (!vendor) {
      throw new HttpError(404, "Vendor not found");
    }

    await prisma.favorite.upsert({
      where: {
        userId_vendorId: {
          userId: req.currentUser.id,
          vendorId,
        },
      },
      create: { userId: req.currentUser.id, vendorId },
      update: {},
    });

    return res.status(201).json({ data: { vendor_id: String(vendorId), favorited: true } });
  }),
);

favoritesRouter.delete(
  "/favorites/:vendorId",
  asyncHandler(async (req, res) => {
    const vendorId = Number(req.params.vendorId);
    if (!Number.isInteger(vendorId) || vendorId <= 0) {
      throw new HttpError(400, "Invalid vendor id");
    }

    await prisma.favorite.deleteMany({
      where: { userId: req.currentUser.id, vendorId },
    });

    return res.json({ data: { vendor_id: String(vendorId), favorited: false } });
  }),
);