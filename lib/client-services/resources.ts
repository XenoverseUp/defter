import { UUID } from "crypto";
import { api } from "./hono-client";
import { InferResponseType } from "hono";

export type StudentResourceData = InferResponseType<(typeof api.students)[":id"]["resources"]["$get"]>[number];

export async function getStudentResources(id: UUID | string): Promise<StudentResourceData[]> {
  const res = await api.students[":id"].resources.$get({ param: { id } });

  if (!res.ok) throw new Error("Failed to fetch student resources");

  return res.json();
}
