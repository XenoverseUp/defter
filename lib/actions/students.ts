import { db } from "@/db";
import { student } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getStudents(userId: string) {
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
