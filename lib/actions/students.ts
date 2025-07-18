import { db } from "@/db";

import { student } from "@/db/schema";
import { UUID } from "crypto";
import { and, desc, eq } from "drizzle-orm";
import { cache as reactCache } from "react";

export const getStudents = reactCache(async (userId: UUID | string) => {
  const students = await db.select().from(student).where(eq(student.userId, userId)).orderBy(desc(student.createdAt));

  return students;
});

export async function getStudentProfile(studentId: string, userId: string) {
  const result = await db
    .select()
    .from(student)
    .where(and(eq(student.id, studentId), eq(student.userId, userId)))
    .limit(1);

  return result[0] ?? null;
}

export async function doesUserOwnStudent(userId: UUID | string, studentId: UUID | string): Promise<boolean> {
  const result = await db
    .select()
    .from(student)
    .where(and(eq(student.userId, userId), eq(student.id, studentId)));

  if (result.length > 0) return true;

  return false;
}
