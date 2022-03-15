import { createClient } from "redis";
import logger from "../logger";

export const redisClient = createClient({
  url: process.env.REDIS_URI || "redis://127.0.0.1:6379",
});

redisClient.on("connect", () => {
  logger.info("Redis connected successfully.");
});

redisClient.on("ready", () => {
  logger.info(`Redis is ready to use.`);
});

redisClient.on("error", (err) => {
  logger.error(`Redis not connected. ${err.message}`);
});

redisClient.on("end", () => {
  logger.warn(`Redis is disconnected.`);
});
