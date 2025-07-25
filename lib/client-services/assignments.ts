import { InferResponseType } from "hono"
import { api } from "./hono-client"

export type ActiveAssignmentData = InferResponseType<
  (typeof api.assignments)[":studentId"]["active"]["$get"]
>["data"]

export type PastAssignmentData = InferResponseType<
  (typeof api.assignments)[":studentId"]["$get"]
>["data"]

export async function getActiveAssignment(studentId: string) {
  const res = await api.assignments[":studentId"].active.$get({
    param: { studentId },
  })

  const json = await res.json()

  console.log(json)

  return json?.data
}

export async function getPastAssignments(studentId: string) {
  const res = await api.assignments[":studentId"].$get({
    param: { studentId },
  })

  const json = await res.json()

  return json?.data
}

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

  const json = await res.json()

  // @ts-ignore
  if (!res.ok) throw new Error(json.error ?? "Failed to create assignment.")

  return json
}
