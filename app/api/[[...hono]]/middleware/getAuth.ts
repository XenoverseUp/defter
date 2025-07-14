import { getSession } from "@/lib/auth";
import { User } from "better-auth";

import { createMiddleware } from "hono/factory";

type Env = {
  Variables: {
    user: User;
  };
};

export const getAuth = createMiddleware<Env>(async (c, next) => {
  try {
    const session = await getSession();

    if (!session?.user) return c.json({ isAuthenticated: false, error: "Unauthorized" }, 401);
    c.set("user", session.user);

    await next();
  } catch (e) {
    console.error(e);
    return c.json({ isAuthenticated: false, error: "Unauthorized" }, 401);
  }
});
