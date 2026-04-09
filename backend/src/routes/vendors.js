import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { buildPagination, parsePagination } from "../utils/pagination.js";
import { HttpError } from "../errors.js";
import { prisma } from "../prisma/client.js";
import { createUserWriteLimiter } from "../middleware/rateLimiters.js";
import {
  onboardingSchema,
  patchVendorSchema,
  vendorFiltersSchema,
} from "../validation/vendor.schema.js";
import { validateOrThrow } from "../validation/validateOrThrow.js";

export const vendorsRouter = Router();
const vendorWriteLimiter = createUserWriteLimiter({ windowMs: 60 * 1000, limit: 10 });

function formatHours(openTime, closeTime) {
  if (!openTime || !closeTime) return null;
  return `${openTime} - ${closeTime}`;
}

function isOpenNow(openTime, closeTime) {
  if (!openTime || !closeTime) return true;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = openTime.split(":").map(Number);
  const [ch, cm] = closeTime.split(":").map(Number);
  const openMinutes = oh * 60 + om;
  const closeMinutes = ch * 60 + cm;
  if (openMinutes <= closeMinutes) {
    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  }
  return nowMinutes >= openMinutes || nowMinutes <= closeMinutes;
}

function distanceKm(lat1, lng1, lat2, lng2) {
  if ([lat1, lng1, lat2, lng2].some((v) => v === null || v === undefined)) return null;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((6371 * c).toFixed(2));
}

function mapVendorSummary(vendor, currentUser, origin) {
  const reviewCount = vendor.reviews.length;
  const rating =
    reviewCount > 0
      ? Number(
          (
            vendor.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
          ).toFixed(2),
        )
      : 0;
  const isVeg = vendor.menuItems.length ? vendor.menuItems.every((item) => item.isVeg) : true;

  return {
    id: String(vendor.id),
    name: vendor.stallName,
    image: vendor.photos[0]?.url ?? null,
    distance: origin
      ? distanceKm(origin.lat, origin.lng, vendor.location?.lat, vendor.location?.lng)
      : null,
    rating,
    reviewCount,
    isVeg,
    tags: vendor.foodTypes ?? [],
    isOpen: isOpenNow(vendor.openTime, vendor.closeTime),
    latitude: vendor.location?.lat ?? null,
    longitude: vendor.location?.lng ?? null,
    phone: vendor.phone,
    hours: formatHours(vendor.openTime, vendor.closeTime),
    status: vendor.status,
    isFavorite:
      vendor.favorites?.some((favorite) => favorite.userId === currentUser.id) ?? false,
  };
}

function mapVendorDetail(vendor, currentUser) {
  const summary = mapVendorSummary(vendor, currentUser);
  return {
    id: String(vendor.id),
    name: vendor.stallName,
    description: vendor.description,
    tags: vendor.foodTypes ?? [],
    phone: vendor.phone,
    open_time: vendor.openTime,
    close_time: vendor.closeTime,
    hours: formatHours(vendor.openTime, vendor.closeTime),
    status: vendor.status,
    address: vendor.location?.addressText ?? null,
    latitude: vendor.location?.lat ?? null,
    longitude: vendor.location?.lng ?? null,
    isOpen: summary.isOpen,
    isVeg: summary.isVeg,
    rating: summary.rating,
    reviewCount: summary.reviewCount,
    image: summary.image,
    images: vendor.photos.map((photo) => photo.url),
    photos: vendor.photos.map((photo) => ({
      id: String(photo.id),
      url: photo.url,
      sort_order: photo.sortOrder,
    })),
    menu: vendor.menuItems.map((item) => ({
      id: String(item.id),
      name: item.name,
      price: Number((item.priceCents / 100).toFixed(2)),
      isVeg: item.isVeg,
      available: item.available,
    })),
    reviews: vendor.reviews.slice(0, 20).map((review) => ({
      id: String(review.id),
      userName:
        review.user.fullName || review.user.email || `User ${review.user.id}`,
      userAvatar: review.user.picture,
      rating: review.rating,
      comment: review.comment,
      created_at: review.createdAt,
      date: review.createdAt.toISOString(),
    })),
    isFavorite: summary.isFavorite,
    created_at: vendor.createdAt,
    updated_at: vendor.updatedAt,
  };
}

async function fetchVendorForDetail(vendorId, currentUser) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: {
      location: true,
      photos: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
      menuItems: { orderBy: { id: "asc" } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
      favorites: { where: { userId: currentUser.id }, select: { userId: true } },
    },
  });

  if (!vendor) return null;
  const canAccessDraft =
    vendor.ownerUserId === currentUser.id || currentUser.role === "admin";
  if (!canAccessDraft && !["submitted", "approved"].includes(vendor.status)) return null;

  return vendor;
}

vendorsRouter.get(
  "/vendors",
  asyncHandler(async (req, res) => {
    const filters = await validateOrThrow(vendorFiltersSchema, req.query);
    const pagination = parsePagination(filters, { maxPageSize: 50 });
    if (filters.radiusKm !== undefined && (filters.lat === undefined || filters.lng === undefined)) {
      throw new HttpError(400, "lat and lng are required when radiusKm is provided");
    }

    const where = {
      status: { in: ["submitted", "approved"] },
      ...(filters.foodType ? { foodTypes: { has: filters.foodType } } : {}),
      ...(filters.query
        ? {
            OR: [
              { stallName: { contains: filters.query, mode: "insensitive" } },
              {
                menuItems: { some: { name: { contains: filters.query, mode: "insensitive" } } },
              },
            ],
          }
        : {}),
    };

    const [total, vendors] = await Promise.all([
      prisma.vendor.count({ where }),
      prisma.vendor.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        skip: pagination.offset,
        take: pagination.pageSize,
        include: {
          location: true,
          photos: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
          menuItems: true,
          reviews: { select: { rating: true } },
          favorites: { where: { userId: req.currentUser.id }, select: { userId: true } },
        },
      }),
    ]);

    const origin =
      filters.lat !== undefined && filters.lng !== undefined
        ? { lat: filters.lat, lng: filters.lng }
        : null;

    let data = vendors.map((vendor) => mapVendorSummary(vendor, req.currentUser, origin));

    if (filters.veg === "true") data = data.filter((vendor) => vendor.isVeg);
    if (filters.openNow === "true") data = data.filter((vendor) => vendor.isOpen);
    if (filters.radiusKm !== undefined) {
      data = data.filter((vendor) => vendor.distance !== null && vendor.distance <= filters.radiusKm);
    }

    return res.json({
      data,
      pagination: buildPagination(total, pagination.page, pagination.pageSize),
    });
  }),
);

vendorsRouter.get(
  "/vendors/:id",
  asyncHandler(async (req, res) => {
    const vendorId = Number(req.params.id);
    if (!Number.isInteger(vendorId) || vendorId <= 0) throw new HttpError(400, "Invalid vendor id");

    const vendor = await fetchVendorForDetail(vendorId, req.currentUser);
    if (!vendor) throw new HttpError(404, "Vendor not found");
    return res.json({ data: mapVendorDetail(vendor, req.currentUser) });
  }),
);

vendorsRouter.get(
  "/vendor/me",
  asyncHandler(async (req, res) => {
    const vendor = await prisma.vendor.findUnique({
      where: { ownerUserId: req.currentUser.id },
      select: { id: true },
    });
    if (!vendor) return res.json({ data: null });
    const hydrated = await fetchVendorForDetail(vendor.id, req.currentUser);
    return res.json({ data: hydrated ? mapVendorDetail(hydrated, req.currentUser) : null });
  }),
);

async function upsertVendorProfile(ownerUserId, payload, statusOverride) {
  return prisma.$transaction(async (tx) => {
    const vendor = await tx.vendor.upsert({
      where: { ownerUserId },
      create: {
        ownerUserId,
        stallName: payload.stall_name,
        description: payload.description ?? null,
        foodTypes: payload.food_types ?? [],
        phone: payload.phone ?? null,
        openTime: payload.open_time ?? null,
        closeTime: payload.close_time ?? null,
        status: statusOverride ?? payload.status ?? "draft",
      },
      update: {
        stallName: payload.stall_name,
        description: payload.description ?? null,
        foodTypes: payload.food_types ?? [],
        phone: payload.phone ?? null,
        openTime: payload.open_time ?? null,
        closeTime: payload.close_time ?? null,
        status: statusOverride ?? payload.status ?? "draft",
        updatedAt: new Date(),
      },
      select: { id: true },
    });

    if (payload.location !== undefined) {
      if (payload.location === null) {
        await tx.vendorLocation.deleteMany({ where: { vendorId: vendor.id } });
      } else {
        await tx.vendorLocation.upsert({
          where: { vendorId: vendor.id },
          create: {
            vendorId: vendor.id,
            addressText: payload.location.address_text,
            lat: payload.location.lat ?? null,
            lng: payload.location.lng ?? null,
          },
          update: {
            addressText: payload.location.address_text,
            lat: payload.location.lat ?? null,
            lng: payload.location.lng ?? null,
          },
        });
      }
    }

    if (payload.photos !== undefined) {
      await tx.vendorPhoto.deleteMany({ where: { vendorId: vendor.id } });
      if (payload.photos.length) {
        await tx.vendorPhoto.createMany({
          data: payload.photos.map((photo, index) => ({
            vendorId: vendor.id,
            url: photo.url,
            sortOrder: photo.sort_order ?? index,
          })),
        });
      }
    }

    if (payload.menu_items !== undefined) {
      await tx.menuItem.deleteMany({ where: { vendorId: vendor.id } });
      if (payload.menu_items.length) {
        await tx.menuItem.createMany({
          data: payload.menu_items.map((item) => ({
            vendorId: vendor.id,
            name: item.name,
            priceCents: Math.round(item.price * 100),
            isVeg: item.is_veg,
            available: item.available,
          })),
        });
      }
    }

    return vendor.id;
  });
}

vendorsRouter.post(
  "/vendor/onboarding/submit",
  vendorWriteLimiter,
  asyncHandler(async (req, res) => {
    const payload = await validateOrThrow(onboardingSchema, req.body);
    const vendorId = await upsertVendorProfile(req.currentUser.id, payload, "submitted");
    await prisma.user.update({
      where: { id: req.currentUser.id },
      data: { role: "vendor", updatedAt: new Date() },
    });
    await prisma.notification.create({
      data: {
        userId: req.currentUser.id,
        type: "vendor_onboarding",
        title: "Vendor profile submitted",
        message: "Your vendor onboarding is submitted and pending review.",
      },
    });
    const vendor = await fetchVendorForDetail(vendorId, req.currentUser);
    return res.status(201).json({ data: mapVendorDetail(vendor, req.currentUser) });
  }),
);

vendorsRouter.patch(
  "/vendor/me",
  vendorWriteLimiter,
  asyncHandler(async (req, res) => {
    const payload = await validateOrThrow(patchVendorSchema, req.body);
    const existing = await prisma.vendor.findUnique({
      where: { ownerUserId: req.currentUser.id },
    });
    if (!existing) throw new HttpError(404, "Vendor profile not found");

    const merged = {
      stall_name: payload.stall_name ?? existing.stallName,
      description: payload.description !== undefined ? payload.description : existing.description,
      food_types: payload.food_types ?? existing.foodTypes,
      phone: payload.phone !== undefined ? payload.phone : existing.phone,
      open_time: payload.open_time !== undefined ? payload.open_time : existing.openTime,
      close_time: payload.close_time !== undefined ? payload.close_time : existing.closeTime,
      status: existing.status,
      location: payload.location,
      photos: payload.photos,
      menu_items: payload.menu_items,
    };

    const vendorId = await upsertVendorProfile(req.currentUser.id, merged);
    const vendor = await fetchVendorForDetail(vendorId, req.currentUser);
    return res.json({ data: mapVendorDetail(vendor, req.currentUser) });
  }),
);