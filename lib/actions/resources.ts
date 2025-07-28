import { db } from "@/db"
import { resource } from "@/db/schema"
import { UUID } from "crypto"
import { desc, eq } from "drizzle-orm"
import { doesUserOwnStudent } from "./students"

export async function getStudentResources(studentId: string, userId?: string) {
  if (userId) {
    const hasStudent = await doesUserOwnStudent(userId, studentId)
    if (!hasStudent) return []
  }

  const resources = await db
    .select()
    .from(resource)
    .where(eq(resource.studentId, studentId))
    .orderBy(desc(resource.createdAt))

  return resources
}
