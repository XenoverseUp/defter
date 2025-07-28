"use client"

import { IfValue } from "@/components/ui/if"
import { ActiveAssignmentData } from "@/lib/client-services/assignments"

import AssignmentCalendar from "./assignment-calendar"
import { Assignment } from "./page"
import { useParams } from "next/navigation"
import { useActiveAssignment } from "@/lib/hooks/useActiveAssignment"

import Empty from "./empty"
import { Link } from "@/i18n/navigation"

export default function AssignmentView() {
  const { id } = useParams<{ id: string }>()

  const { activeAssignment } = useActiveAssignment({ id })

  if (!activeAssignment) return <Empty />

  return (
    <div className="py-6 flex flex-col gap-6">
      <header className="flex px-6 items-center gap-4">
        <div>
          <h2 className="text-lg font-medium flex items-center gap-1.5">
            Weekly Schedule
          </h2>
        </div>

        <p className="ml-auto text-sm font-medium">July 2025</p>
      </header>

      <IfValue
        value={activeAssignment}
        renderItem={(val) => (
          <AssignmentCalendar
            assignments={assignmentToEntries(val)}
            startsOn={new Date(val.startsOn)}
          />
        )}
      />

      <Link href={`/dashboard/student/${id}/weekly-assignments/create`}>
        Create
      </Link>
    </div>
  )
}

function assignmentToEntries(
  activeAssignment: NonNullable<ActiveAssignmentData>,
): Assignment[] {
  const assignments = new Array<Assignment>()

  for (const day of activeAssignment.days) {
    for (const { resourceId, assignedQuestions, id } of day.entries) {
      assignments.push({
        day: day.day,
        questionCount: assignedQuestions,
        resourceId,
        id,
      })
    }
  }

  return assignments
}
