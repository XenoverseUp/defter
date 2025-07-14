import { db } from "@/db";
import { gradeEnum, student } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { withAuthAndValidation } from "@/lib/middleware/with-auth-and-validation";

const paramsSchema = z.object({
  id: z.uuid(),
});

const patchBodySchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  grade: z.enum(gradeEnum.enumValues).optional(),
});

export const PATCH = withAuthAndValidation({ params: paramsSchema, body: patchBodySchema }, async (user, _, { params, body }) => {
  if (!body.firstName && !body.lastName && !body.grade) return new Response("No fields to update provided", { status: 400 });

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

  if (updated.length === 0) return new Response("Not found", { status: 404 });

  return Response.json(updated[0]);
});

export const DELETE = withAuthAndValidation({ params: paramsSchema }, async (user, _, { params }) => {
  const deleted = await db
    .delete(student)
    .where(and(eq(student.id, params.id), eq(student.userId, user.id)))
    .returning({ id: student.id });

  return Response.json({ success: true, deleted });
});
