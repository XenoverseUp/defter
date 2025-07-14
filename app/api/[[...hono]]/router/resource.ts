import { Hono } from "hono";
import { getAuth } from "../middleware/getAuth";

export const resourceRouter = new Hono().use(getAuth).get("/", async (c) => {
  c.json("");
});

export default resourceRouter;
