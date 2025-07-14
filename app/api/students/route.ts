import { z } from "zod";
import { withAuthAndValidation } from "@/lib/middleware/with-auth-and-validation";
import { db } from "@/db";
import { gradeEnum, student } from "@/db/schema";

import { getStudents } from "@/lib/actions/students";
import { and, eq, inArray } from "drizzle-orm";
import { withAuth } from "@/lib/middleware/with-auth";

const deleteStudentsSchema = z.object({
  ids: z.array(z.string().min(1)),
});

const createStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  grade: z.enum(gradeEnum.enumValues),
  location: z
    .tuple([
      z.string().min(1), // country
      z.string().optional(), // city
    ])
    .optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const GET = withAuth(async (user) => {
  const students = await getStudents(user.id);
  return Response.json(students);
});

export const POST = withAuthAndValidation({ body: createStudentSchema }, async (user, _, { body }) => {
  const { firstName, lastName, grade, location, phone, notes } = body;

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

  return Response.json(inserted[0]);
});

export const DELETE = withAuthAndValidation({ body: deleteStudentsSchema }, async (user, _, { body }) => {
  const deleted = await db
    .delete(student)
    .where(and(eq(student.userId, user.id), inArray(student.id, body.ids)))
    .returning({ id: student.id });

  return Response.json({ success: true, deleted });
});
