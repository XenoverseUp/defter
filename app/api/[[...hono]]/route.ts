import { Hono } from "hono";
import { handle } from "hono/vercel";
import studentRouter from "./router/student";

const app = new Hono().basePath("api");

app.route("/students", studentRouter);

app.all("*", (c) => {
  return c.notFound();
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
