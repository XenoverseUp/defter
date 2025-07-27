import { getUser } from "@/lib/auth"
import AssignmentView from "./assignment-view"
import { getStudentResources } from "@/lib/actions/resources"

type Assignment = {
  day: number
  questionCount: number
  resourceId: string
  id: string
}

export default async function WeeklyAssignments() {
  return (
    <section>
      <AssignmentView />
    </section>
  )
}

export { type Assignment }
