import { db } from "@/db";
import { student } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getStudents(userId: string) {
  const students = await db.select().from(student).where(eq(student.userId, userId)).orderBy(desc(student.createdAt));
  return students;
}
