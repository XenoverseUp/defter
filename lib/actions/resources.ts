import { db } from "@/db";
import { resource } from "@/db/schema";
import { UUID } from "crypto";
import { desc, eq } from "drizzle-orm";

export async function getStudentResources(studentId: UUID | string) {
  const resources = await db.select().from(resource).where(eq(resource.studentId, studentId)).orderBy(desc(resource.createdAt));

  return resources;
}
