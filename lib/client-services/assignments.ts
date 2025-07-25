import { api } from "./hono-client"

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
