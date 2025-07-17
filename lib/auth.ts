import { betterAuth, User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { headers } from "next/headers";
import { cache } from "react";

export const auth = betterAuth({
  appName: "Defter",
  emailAndPassword: { enabled: true },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [nextCookies()],
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60,
  },
});

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export const getUser = cache(async (): Promise<User | null> => {
  const session = await getSession();

  if (!session?.user) return null;
  return session.user;
});
