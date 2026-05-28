import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

// For direct use (ping, cache, etc.)
export const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// For BullMQ queues and workers (plain object, avoids ioredis version conflict)
export const redis = {
  url: process.env.REDIS_URL,
};

redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis is ready to use");
});

redisClient.on("error", (err) => {
  console.log("Redis error:", err.message);
});

redisClient.on("close", () => {
  console.log("Redis connection closed");
});

(async () => {
  try {
    const res = await redisClient.ping();
    console.log("Redis PING:", res);
  } catch (err: any) {
    console.log(" Redis PING failed:", err.message);
  }
})();

export default redisClient;