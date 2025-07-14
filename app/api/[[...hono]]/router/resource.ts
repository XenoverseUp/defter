import { Hono } from "hono";
import { getAuth } from "../middleware/getAuth";

const resourceRouter = new Hono().use(getAuth);

resourceRouter.get("/");

export default resourceRouter;
