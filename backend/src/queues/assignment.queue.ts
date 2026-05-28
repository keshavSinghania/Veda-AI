import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const assignmentQueue = new Queue("assignment", {
  connection: redis,
});