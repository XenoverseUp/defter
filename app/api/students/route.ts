import { z } from "zod";
import { withAuthAndValidation } from "@/lib/middleware/with-auth-and-validation";
import { db } from "@/db";
import { student } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = withAuthAndValidation({}, async (user) => {
  const students = await db.select().from(student).where(eq(student.userId, user.id));
  return Response.json(students);
});

const createStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  grade: z.enum(["middle-school", "high-school"]),
});

export const POST = withAuthAndValidation({ body: createStudentSchema }, async (user, _, { body }) => {
  const inserted = await db
    .insert(student)
    .values({
      firstName: body.firstName,
      lastName: body.lastName,
      grade: body.grade,
      userId: user.id,
    })
    .returning();

  return Response.json(inserted[0]);
});
