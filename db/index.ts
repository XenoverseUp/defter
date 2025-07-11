import { drizzle } from "drizzle-orm/neon-http";

if (!process.env.DB_URL) throw new Error("Please provide a DB Url.");

export const db = drizzle(process.env.DB_URL!);
