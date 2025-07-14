import { Hono } from "hono";
import { getAuth } from "../middleware/getAuth";
import { getStudents } from "@/lib/actions/students";
import { zValidator } from "@hono/zod-validator";

import { student } from "@/db/schema";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { createStudentSchema, deleteStudentsSchema, patchStudentSchema, studentIdParamSchema } from "../validator/student";
import z from "zod";

const studentRouter = new Hono().use(getAuth);

studentRouter.get("/", async (c) => {
  const { user } = c.var;
  const students = await getStudents(user.id);
  return Response.json(students);
});

studentRouter.post("/", zValidator("json", createStudentSchema), async (c) => {
  const user = c.var.user;
  const { firstName, lastName, grade, location, phone, notes } = c.req.valid("json");

  const [country, cityRaw] = location ?? [];
  const city = cityRaw?.trim() || undefined;

  const inserted = await db
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
    .returning();

  return c.json(inserted[0]);
});

studentRouter.delete("/", zValidator("json", deleteStudentsSchema), async (c) => {
  const user = c.var.user;
  const { ids } = c.req.valid("json");

  const deleted = await db
    .delete(student)
    .where(and(eq(student.userId, user.id), inArray(student.id, ids)))
    .returning({ id: student.id });

  return c.json({ success: true, deleted });
});

studentRouter.delete("/:id", zValidator("param", studentIdParamSchema), async (c) => {
  const user = c.var.user;
  const params = c.req.valid("param");

  const deleted = await db
    .delete(student)
    .where(and(eq(student.id, params.id), eq(student.userId, user.id)))
    .returning({ id: student.id });

  return Response.json({ success: true, deleted });
});

studentRouter.patch("/:id", zValidator("param", studentIdParamSchema), zValidator("json", patchStudentSchema), async (c) => {
  const body = c.req.valid("json");
  const params = c.req.valid("param");
  const user = c.var.user;

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

  return c.json({ success: true, data: updated[0] });
});

export default studentRouter;
