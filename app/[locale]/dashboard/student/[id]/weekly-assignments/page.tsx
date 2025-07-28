import AssignmentView from "./assignment-view"

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
