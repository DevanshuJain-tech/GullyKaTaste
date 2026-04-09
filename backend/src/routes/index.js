import { Router } from "express";
import { meRouter } from "./me.js";
import { vendorsRouter } from "./vendors.js";
import { favoritesRouter } from "./favorites.js";
import { reviewsRouter } from "./reviews.js";
import { postsRouter } from "./posts.js";
import { reelsRouter } from "./reels.js";
import { addressesRouter } from "./addresses.js";
import { notificationsRouter } from "./notifications.js";
import { uploadsRouter } from "./uploads.js";

export const apiRouter = Router();

apiRouter.use(meRouter);
apiRouter.use(vendorsRouter);
apiRouter.use(favoritesRouter);
apiRouter.use(reviewsRouter);
apiRouter.use(postsRouter);
apiRouter.use(reelsRouter);
apiRouter.use(addressesRouter);
apiRouter.use(notificationsRouter);
apiRouter.use(uploadsRouter);