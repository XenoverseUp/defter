import { z } from "zod";
import { withAuthAndValidation } from "@/lib/middleware/with-auth-and-validation";
import { db } from "@/db";
import { student } from "@/db/schema";

import { getStudents } from "@/lib/actions/students";

export const GET = withAuthAndValidation({}, async (user) => {
  const students = await getStudents(user.id);
  return Response.json(students);
});

const createStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  grade: z.enum(["middle-school", "high-school"]),
  location: z
    .tuple([
      z.string().min(1), // country
      z.string().optional(), // city
    ])
    .optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
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
