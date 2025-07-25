"use client"

import AssignmentCalendar from "@/app/[locale]/dashboard/student/[id]/weekly-assignments/create/assignment-calendar"
import { Button } from "@/components/ui/button"
import { If } from "@/components/ui/if"
import { useRouter } from "@/i18n/navigation"
import { createAssignment } from "@/lib/client-services/assignments"
import { mutateActiveAssignment } from "@/lib/hooks/useActiveAssignment"

import { cn, DateUtils } from "@/lib/utils"

import { Loader, PlusCircleIcon } from "lucide-react"
import { useParams } from "next/navigation"
import {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react"
import { toast } from "sonner"

type Assignment = {
  day: number
  questionCount: number
  resourceId: string
  id: string
}

const AssignmentContext = createContext<{
  assignments: Assignment[]
  setAssignments: Dispatch<SetStateAction<Assignment[]>>
}>({
  assignments: [],
  setAssignments: () => {},
})

function CreateAssignments() {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const { id: studentId } = useParams<{ id: string }>()

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const totalQuestions = useMemo(
    () =>
      assignments
        .map(({ questionCount }) => questionCount)
        .reduce((a, b) => a + b, 0),
    [assignments],
  )

  async function onSubmit() {
    setLoading(true)

    try {
      const groupedByDay = Object.values(
        assignments.reduce<
          Record<number, Parameters<typeof createAssignment>[1]["days"][number]>
        >((acc, { day, questionCount, resourceId }) => {
          acc[day] ??= { day, assignments: [] }
          acc[day].assignments.push({ resourceId, questionCount })
          return acc
        }, {}),
      )

      await createAssignment(studentId, {
        startsOn: DateUtils.getStartOfTheWeek(),
        days: groupedByDay,
      })

      await mutateActiveAssignment(studentId)

      toast.success("Assignment created successfully.")
      router.push(`/dashboard/student/${studentId}/weekly-assignments`)
      router.refresh()
    } catch (err) {
      const e = err as Error
      toast.error(e.message ?? "Failed to create the assignment.")
    }
    setLoading(false)
  }

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

      <AssignmentContext.Provider value={{ assignments, setAssignments }}>
        <AssignmentCalendar />
      </AssignmentContext.Provider>

      <div className="flex justify-end items-center gap-4 w-full">
        <If
          condition={totalQuestions > 0}
          renderItem={() => (
            <div>
              <p className="text-xs text-muted-foreground">
                {totalQuestions} questions were planned for this week.
              </p>
            </div>
          )}
        />
        <Button
          onClick={onSubmit}
          variant="outline"
          disabled={!assignments.length}
          className={cn({
            "pointer-events-none": loading,
          })}
        >
          <PlusCircleIcon /> Assign
          <span
            className={cn(
              "absolute inset-0 bg-background flex items-center justify-center transition-opacity opacity-0 pointer-events-none",
              {
                "opacity-100": loading,
              },
            )}
          >
            <Loader className="animate-spin" />
          </span>
        </Button>
      </div>
    </div>
  )
}

export { type Assignment, AssignmentContext }
export default CreateAssignments
