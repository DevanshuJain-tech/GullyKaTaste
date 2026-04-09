import { prisma } from "../prisma/client.js";

export async function attachCurrentUser(req, _res, next) {
  try {
    req.currentUser = await prisma.user.upsert({
      where: { auth0Sub: req.auth.sub },
      create: {
        auth0Sub: req.auth.sub,
        email: req.auth.email ?? null,
        fullName: req.auth.name ?? null,
        picture: req.auth.picture ?? null,
      },
      update: {
        email: req.auth.email ?? null,
        fullName: req.auth.name ?? null,
        picture: req.auth.picture ?? null,
        updatedAt: new Date(),
      },
    });
    next();
  } catch (error) {
    next(error);
  }
}