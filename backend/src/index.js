import { config } from "./config.js";
import { apiRouter } from "./routes/index.js";
import { createApp } from "./app.js";
import { logger } from "./logger.js";

async function start() {
  const app = createApp({ routes: apiRouter, corsOrigins: config.corsOrigins });

  app.listen(config.port, () => {
    logger.info({ port: config.port }, "Backend server listening");
  });
}

start().catch((error) => {
  logger.error({ err: error }, "Server startup failed");
  process.exit(1);
});