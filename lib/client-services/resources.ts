import { UUID } from "crypto";
import { api } from "./hono-client";
import { InferResponseType } from "hono";
import { subjectEnum } from "@/db/schema";

export type StudentResourceData = InferResponseType<(typeof api.students)[":id"]["resources"]["$get"]>[number];

export async function getStudentResources(studentId: UUID | string): Promise<StudentResourceData[]> {
  const res = await api.students[":id"].resources.$get({ param: { id: studentId } });

  if (!res.ok) throw new Error("Failed to fetch student resources");

  return res.json();
}

export async function createStudentResource(
  studentId: UUID | string,
  json: {
    title: string;
    subject: (typeof subjectEnum.enumValues)[number];
    press: string;
    totalQuestions: number;
    questionsRemaining: number;
  },
) {
  const res = await api.students[":id"].resources.$post({
    param: { id: studentId },
    json,
  });

  if (!res.ok) throw new Error("Failed to create student resources");

  return res.json();
}

export async function deleteStudentResource(resourceId: UUID | string) {
  const res = await api.resources[":id"].$delete({ param: { id: resourceId } });

  if (!res.ok) throw new Error("Failed to delete resource");

  return res.json();
}
