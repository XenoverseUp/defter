import { drizzle } from "drizzle-orm/neon-http";

console.log("DB:", !!process.env.DB_URL);

export const db = drizzle(process.env.DB_URL!);
