import { UUID } from "crypto"
import { api } from "./hono-client"
import { InferResponseType } from "hono"
import { subjectEnum } from "@/db/schema"
import { StudentUtils } from "../utils"

export type StudentResourceData = InferResponseType<
  (typeof api.resources)[":studentId"]["$get"]
>[number]

export async function getStudentResources(
  studentId: UUID | string,
): Promise<StudentResourceData[]> {
  const res = await api.resources[":studentId"].$get({
    param: { studentId },
  })

  if (!res.ok) throw new Error("Failed to fetch student resources")

  return res.json()
}

export async function createStudentResource(
  studentId: UUID | string,
  json: {
    title: string
    subject: StudentUtils.Subject
    press: string
    totalQuestions: number
    questionsRemaining: number
  },
) {
  const res = await api.resources[":studentId"].$post({
    param: { studentId },
    json,
  })

  if (!res.ok) throw new Error("Failed to create student resources")

  return res.json()
}

export async function deleteStudentResource(resourceId: UUID | string) {
  const res = await api.resources[":resourceId"].$delete({
    param: { resourceId },
  })

  if (!res.ok) throw new Error("Failed to delete resource")

  return res.json()
}
