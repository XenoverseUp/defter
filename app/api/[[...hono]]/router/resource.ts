import { Hono } from "hono";
import { getAuth } from "../middleware/getAuth";
import { db } from "@/db";
import { resource } from "@/db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { deleteResourceSchema } from "../validator/resource";
import { doesUserOwnStudent } from "@/lib/actions/students";

export const resourceRouter = new Hono()
  .use(getAuth)

  .delete("/:id", zValidator("param", deleteResourceSchema), async (c) => {
    const { user } = c.var;
    const { id } = c.req.valid("param");

    const [retrieved] = await db.select().from(resource).where(eq(resource.id, id));
    if (!retrieved) return c.json({ success: false, message: "No such resource." }, 404);

    const doesUserOwn = await doesUserOwnStudent(user.id, retrieved.studentId);
    if (!doesUserOwn) return c.json({ success: false, message: "Resource doesn't belong to user." }, 403);

    try {
      await db.delete(resource).where(eq(resource.id, id));
      return c.json({ success: true, message: `Resource ${id} has been removed.` });
    } catch {
      return c.json({ success: false, message: "Internal server error occured." }, 500);
    }
  })

  .get("/");

export default resourceRouter;
