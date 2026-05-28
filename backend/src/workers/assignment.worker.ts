import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { getIO } from "../config/socket";
import { Assignment } from "../models/Assignment.model";
import { generateAIQuestionPaper } from "../services/gemini.service";

export const worker = new Worker(
  "assignment",
  async (job) => {
    const io = getIO();
    const { dbId } = job.data;

    console.log("JOB RECEIVED:", job.data);
    try {
      io.emit("assignment:status", {
        jobId: job.id,
        dbId,
        status: "processing",
        progress: 10,
      });

      await job.updateProgress(30);

      io.emit("assignment:status", {
        jobId: job.id,
        dbId,
        status: "processing",
        progress: 30,
      });

      const result = await generateAIQuestionPaper(job.data);

      await job.updateProgress(80);

      io.emit("assignment:status", {
        jobId: job.id,
        dbId,
        status: "processing",
        progress: 80,
      });

      await Assignment.findByIdAndUpdate(dbId, {
        result,
        status: "completed",
      });

      io.emit("assignment:status", {
        jobId: job.id,
        dbId,
        status: "completed",
        progress: 100,
        result,
      });

      console.log("✅ Job completed:", job.id);

      return result;
    } catch (error: any) {
      console.error("❌ Worker error:", error);

      await Assignment.findByIdAndUpdate(dbId, {
        status: "failed",
      });

      io.emit("assignment:status", {
        jobId: job.id,
        dbId,
        status: "failed",
        error: error.message,
      });

      throw error;
    }
  },
  {
    connection: redis,
  }
);