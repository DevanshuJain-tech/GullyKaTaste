import { Router } from "express";
import * as yup from "yup";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../errors.js";
import { validateOrThrow } from "../validation/validateOrThrow.js";

export const addressesRouter = Router();

const addressSchema = yup.object({
  type: yup.string().oneOf(["home", "work", "other"]).default("other"),
  label: yup.string().trim().min(1).max(80).required(),
  address_text: yup.string().trim().min(1).max(500).required(),
  lat: yup.number().min(-90).max(90).nullable().optional(),
  lng: yup.number().min(-180).max(180).nullable().optional(),
  is_default: yup.boolean().default(false),
});

const patchAddressSchema = yup
  .object({
    type: yup.string().oneOf(["home", "work", "other"]).optional(),
    label: yup.string().trim().min(1).max(80).optional(),
    address_text: yup.string().trim().min(1).max(500).optional(),
    lat: yup.number().min(-90).max(90).nullable().optional(),
    lng: yup.number().min(-180).max(180).nullable().optional(),
    is_default: yup.boolean().optional(),
  })
  .test("at-least-one", "At least one field is required", (data) => {
    if (!data) return false;
    return Object.keys(data).length > 0;
  });

function mapAddress(row) {
  return {
    id: String(row.id),
    type: row.type,
    label: row.label,
    address_text: row.address_text,
    lat: row.lat,
    lng: row.lng,
    is_default: row.is_default,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

addressesRouter.get(
  "/addresses",
  asyncHandler(async (req, res) => {
    const result = await prisma.address.findMany({
      where: { userId: req.currentUser.id },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }, { id: "desc" }],
    });

    return res.json({
      data: result.map((address) =>
        mapAddress({
          id: address.id,
          type: address.type,
          label: address.label,
          address_text: address.addressText,
          lat: address.lat,
          lng: address.lng,
          is_default: address.isDefault,
          created_at: address.createdAt,
          updated_at: address.updatedAt,
        }),
      ),
    });
  }),
);

addressesRouter.post(
  "/addresses",
  asyncHandler(async (req, res) => {
    const payload = await validateOrThrow(addressSchema, req.body);

    const created = await prisma.$transaction(async (tx) => {
      if (payload.is_default) {
        await tx.address.updateMany({
          where: { userId: req.currentUser.id },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId: req.currentUser.id,
          type: payload.type,
          label: payload.label,
          addressText: payload.address_text,
          lat: payload.lat ?? null,
          lng: payload.lng ?? null,
          isDefault: payload.is_default,
        },
      });
    });

    return res.status(201).json({
      data: mapAddress({
        id: created.id,
        type: created.type,
        label: created.label,
        address_text: created.addressText,
        lat: created.lat,
        lng: created.lng,
        is_default: created.isDefault,
        created_at: created.createdAt,
        updated_at: created.updatedAt,
      }),
    });
  }),
);

addressesRouter.patch(
  "/addresses/:id",
  asyncHandler(async (req, res) => {
    const addressId = Number(req.params.id);
    if (!Number.isInteger(addressId) || addressId <= 0) {
      throw new HttpError(400, "Invalid address id");
    }

    const payload = await validateOrThrow(patchAddressSchema, req.body);

    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId: req.currentUser.id },
    });
    if (!existing) {
      throw new HttpError(404, "Address not found");
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (payload.is_default) {
        await tx.address.updateMany({
          where: { userId: req.currentUser.id },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id: addressId },
        data: {
          ...(payload.type !== undefined ? { type: payload.type } : {}),
          ...(payload.label !== undefined ? { label: payload.label } : {}),
          ...(payload.address_text !== undefined
            ? { addressText: payload.address_text }
            : {}),
          ...(payload.lat !== undefined ? { lat: payload.lat } : {}),
          ...(payload.lng !== undefined ? { lng: payload.lng } : {}),
          ...(payload.is_default !== undefined
            ? { isDefault: payload.is_default }
            : {}),
          updatedAt: new Date(),
        },
      });
    });

    return res.json({
      data: mapAddress({
        id: updated.id,
        type: updated.type,
        label: updated.label,
        address_text: updated.addressText,
        lat: updated.lat,
        lng: updated.lng,
        is_default: updated.isDefault,
        created_at: updated.createdAt,
        updated_at: updated.updatedAt,
      }),
    });
  }),
);

addressesRouter.delete(
  "/addresses/:id",
  asyncHandler(async (req, res) => {
    const addressId = Number(req.params.id);
    if (!Number.isInteger(addressId) || addressId <= 0) {
      throw new HttpError(400, "Invalid address id");
    }

    await prisma.address.deleteMany({
      where: { id: addressId, userId: req.currentUser.id },
    });

    return res.json({ data: { id: String(addressId), deleted: true } });
  }),
);

addressesRouter.post(
  "/addresses/:id/default",
  asyncHandler(async (req, res) => {
    const addressId = Number(req.params.id);
    if (!Number.isInteger(addressId) || addressId <= 0) {
      throw new HttpError(400, "Invalid address id");
    }

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.address.findFirst({
        where: { id: addressId, userId: req.currentUser.id },
      });
      if (!existing) {
        throw new HttpError(404, "Address not found");
      }

      await tx.address.updateMany({
        where: { userId: req.currentUser.id },
        data: { isDefault: false },
      });

      return tx.address.update({
        where: { id: addressId },
        data: { isDefault: true, updatedAt: new Date() },
      });
    });

    return res.json({
      data: mapAddress({
        id: result.id,
        type: result.type,
        label: result.label,
        address_text: result.addressText,
        lat: result.lat,
        lng: result.lng,
        is_default: result.isDefault,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      }),
    });
  }),
);