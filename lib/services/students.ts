import { db } from "@/db";
import { student } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "../auth";

export async function getStudents(userId: string) {
  const students = await db.select().from(student).where(eq(student.userId, userId));
  return students;
}
