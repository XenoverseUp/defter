import { db } from "@/db";
import { student, resource } from "@/db/schema";
import { UUID } from "crypto";
import { and, desc, eq } from "drizzle-orm";

export async function getStudents(userId: UUID | string) {
  const students = await db.select().from(student).where(eq(student.userId, userId)).orderBy(desc(student.createdAt));
  return students;
}

export async function getStudentProfile(studentId: string, userId: string) {
  const result = await db
    .select()
    .from(student)
    .where(and(eq(student.id, studentId), eq(student.userId, userId)))
    .limit(1);

  return result[0] ?? null;
}
