import { Hono } from "hono";
import { handle } from "hono/vercel";
import { studentRouter } from "./router/student";
import { resourceRouter } from "./router/resource";

const app = new Hono()
  .basePath("api")
  .route("/students", studentRouter)
  .route("/resources", resourceRouter)
  .all("*", (c) => {
    return c.notFound();
  });

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
