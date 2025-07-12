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
});

export const POST = withAuthAndValidation({ body: createStudentSchema }, async (user, _, { body }) => {
  const { firstName, lastName, grade } = body;

  const inserted = await db
    .insert(student)
    .values({
      firstName,
      lastName,
      grade,
      userId: user.id,
    })
    .returning();

  return Response.json(inserted[0]);
});
