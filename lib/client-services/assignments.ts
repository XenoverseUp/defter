import { api } from "./hono-client"
import { InferResponseType } from "hono"

export async function createAssignment(
  studentId: string,
  payload: {
    startsOn: string | Date // ISO string or date
    days: Array<{
      day: number
      assignments: Array<{
        resourceId: string
        questionCount: number
      }>
    }>
  },
) {
  const res = await api.assignments.$post({
    json: {
      studentId,
      ...payload,
    },
  })

  if (!res.ok) throw new Error("Failed to fetch student resources")

  return res.json()
}
