import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { headers } from "next/headers";

export const auth = betterAuth({
  appName: "Defter",
  emailAndPassword: { enabled: true },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [nextCookies()],
});

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}
