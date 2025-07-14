import { api } from "./hono-client";
import type { InferResponseType } from "hono";

export type StudentData = InferResponseType<typeof api.students.$get>[number];

export async function getStudents() {
  const res = await api.students.$get();

  if (!res.ok) throw new Error("Failed to get students");

  return res.json();
}

export async function createStudent(data: Omit<StudentData, "id" | "userId" | "createdAt" | "updatedAt">) {
  const res = await api.students.$post({ json: data });

  if (!res.ok) throw new Error("Failed to create student");

  return res.json();
}

export const deleteStudents = async (ids: string[]) => {
  const res = await api.students.$delete({ json: { ids } });

  if (!res.ok) throw new Error("Failed to delete students");

  return res.json();
};

export const deleteStudent = async (id: string) => {
  const res = await api.students[":id"].$delete({ param: { id } });

  if (!res.ok) throw new Error("Failed to delete students");

  return res.json();
};
