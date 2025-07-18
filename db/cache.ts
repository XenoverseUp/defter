import { Redis } from "ioredis";

export const cache = new Redis(process.env.REDIS_URL as string);

cache.on("ready", () => console.log("[INFO] Connected to Redis Client."));

export const cacheKeys = {
  students: (userId: string) => `students:${userId}`,
  studentResources: (studentId: string) => `student:${studentId}:resources`,
};
