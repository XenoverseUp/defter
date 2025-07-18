import { Hono } from "hono";
import { getAuth } from "../middleware/getAuth";
import { getStudents } from "@/lib/actions/students";
import { zValidator } from "@hono/zod-validator";
import { resource, student } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { createStudentSchema, deleteStudentsSchema, patchStudentSchema, studentIdParamSchema } from "../validator/student";
import { createResourceSchema } from "../validator/resource";
import { requireOwnsStudent } from "../middleware/requireOwnsStudent";
import { getStudentResources } from "@/lib/actions/resources";
import { cache, cacheKeys } from "@/db/cache";

export const studentRouter = new Hono()
  .use(getAuth)

  .get("/", async (c) => {
    const { user } = c.var;
    const students = await getStudents(user.id);

    return c.json(students);
  })

  .post("/", zValidator("json", createStudentSchema), async (c) => {
    const user = c.var.user;
    const key = cacheKeys.students(user.id);

    const { firstName, lastName, grade, city, country, phone, notes } = c.req.valid("json");

    const inserted = (
      await db
        .insert(student)
        .values({
          firstName,
          lastName,
          grade,
          userId: user.id,
          country,
          city,
          phone,
          notes,
        })
        .returning()
    ).at(0);

    await cache.del(key);

    return c.json(inserted);
  })

  .delete("/", zValidator("json", deleteStudentsSchema), async (c) => {
    const user = c.var.user;
    const key = cacheKeys.students(user.id);

    const { ids } = c.req.valid("json");

    const deleted = await db
      .delete(student)
      .where(and(eq(student.userId, user.id), inArray(student.id, ids)))
      .returning({ id: student.id });

    await cache.del(key);

    return c.json({ success: true, deleted });
  })

  .delete("/:id", zValidator("param", studentIdParamSchema), requireOwnsStudent, async (c) => {
    const user = c.var.user;
    const key = cacheKeys.students(user.id);
    const params = c.req.valid("param");

    const deleted = await db
      .delete(student)
      .where(and(eq(student.id, params.id), eq(student.userId, user.id)))
      .returning({ id: student.id });

    if (deleted.length === 0) {
      return c.notFound();
    }

    await cache.del(key);

    return c.json({ success: true, deleted });
  })

  .patch(
    "/:id",
    zValidator("param", studentIdParamSchema),
    requireOwnsStudent,
    zValidator("json", patchStudentSchema),
    async (c) => {
      const body = c.req.valid("json");
      const params = c.req.valid("param");
      const user = c.var.user;
      const key = cacheKeys.students(user.id);

      if (!body.firstName && !body.lastName && !body.grade)
        return c.json({ success: true, message: "No fields to update provided" }, 200);

      const { firstName, lastName, grade } = body;

      const updated = await db
        .update(student)
        .set({
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(grade && { grade }),
        })
        .where(and(eq(student.id, params.id), eq(student.userId, user.id)))
        .returning();

      if (updated.length === 0) return c.json({ success: false, message: "No such user found!" }, 404);

      await cache.del(key);

      return c.json({ success: true, data: updated[0] });
    },
  )

  .get("/:id/resources", zValidator("param", studentIdParamSchema), requireOwnsStudent, async (c) => {
    const student = c.var.student;

    const resources = await getStudentResources(student.id);
    return c.json(resources);
  })

  .post(
    "/:id/resources",
    zValidator("param", studentIdParamSchema),
    requireOwnsStudent,
    zValidator("json", createResourceSchema),
    async (c) => {
      const { id: studentId } = c.var.student;
      const body = c.req.valid("json");

      const [created] = await db
        .insert(resource)
        .values({
          studentId,
          ...body,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return c.json({ success: true, resource: created });
    },
  );
