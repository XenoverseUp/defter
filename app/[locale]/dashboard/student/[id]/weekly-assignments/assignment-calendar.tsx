import { useStudentResources } from "@/lib/hooks/useResources"
import { cn, DateUtils } from "@/lib/utils"
import { useParams } from "next/navigation"
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
} from "react"

import { StudentUtils } from "@/lib/utils"
import CreateAssignmentForm from "./create/create-assignment-form"

import { If, IfValue } from "@/components/ui/if"
import { XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import AssignmentCalendarSkeleton from "./assignment-calendar-skeleton"
import { Assignment } from "./page"

export const AssignmentContext = createContext<{
  assignments: Assignment[]
  setAssignments?: Dispatch<SetStateAction<Assignment[]>>
}>({
  assignments: [],
  setAssignments: () => {},
})

type Props =
  | {
      form?: true
      assignments: Assignment[]
      setAssignments: Dispatch<SetStateAction<Assignment[]>>
    }
  | {
      form?: false
      assignments: Assignment[]
      startsOn: Date
    }

export default function AssignmentCalendar(props: Props) {
  const { id } = useParams<{ id: string }>()

  const { isLoading } = useStudentResources({ id })

  if (props.form && isLoading) return <AssignmentCalendarSkeleton />

  const contextValue = {
    assignments: props.assignments,
    setAssignments: props.form ? props.setAssignments : undefined,
  }

  return (
    <AssignmentContext.Provider value={contextValue}>
      <div className="w-full min-h-90 grid grid-cols-7 grid-rows-1 rounded-lg divide-x border">
        {(props.form
          ? DateUtils.getCurrentWeekdates()
          : // @ts-expect-error couldn't infer the type
            DateUtils.getWeekdates(props.startsOn)
        ).map((date, i) => (
          <DayView
            key={`day-view-${i}`}
            index={i}
            date={date}
            items={props.assignments.filter(({ day }) => day === i)}
          >
            <If
              condition={!!props.form}
              renderItem={() => (
                <CreateAssignmentForm
                  title={DateUtils.format(date, {
                    day: "numeric",
                    weekday: "long",
                    year: "numeric",
                  })}
                  day={i}
                />
              )}
            />
          </DayView>
        ))}
      </div>
    </AssignmentContext.Provider>
  )
}

function DayView({
  index,
  date,
  items = [],
  children,
}: {
  index: number
  date: Date
  items?: Assignment[]
  children?: ReactNode
}) {
  if (index >= 7) return

  return (
    <div className="flex flex-col divide-y">
      <header
        className={cn(
          "h-10 flex items-center justify-center text-sm text-muted-foreground",
          {
            "text-muted-foreground/50": [5, 6].includes(index),
          },
        )}
      >
        <span>{DateUtils.format(date, { weekday: "short" })}</span>
        <span
          className={cn(
            "rounded-full size-6 flex items-center justify-center",
            {
              "bg-neutral-900/75 ml-1.5 text-white text-xs font-medium":
                DateUtils.isToday(date),
            },
          )}
        >
          {date.getDate()}
        </span>
      </header>
      <div
        className={cn("flex flex-col gap-2 px-2 py-2 h-full", {
          "bg-muted/50": [5, 6].includes(index),
        })}
      >
        {items.map((item) => (
          <Entry key={item.id} {...{ item }} />
        ))}

        {children}
      </div>
    </div>
  )
}

function Entry({ item }: { item: Assignment }) {
  const { id } = useParams<{ id: string }>()
  const tSubject = useTranslations("subject")

  const { data } = useStudentResources({ id })
  const { setAssignments } = useContext(AssignmentContext)

  const resource = data?.find(({ id }) => id === item.resourceId)
  if (!resource) return null

  const color = subjectColors[resource.subject] ?? {
    bg: "bg-muted",
    text: "text-foreground",
    content: "bg-muted/50",
    border: "",
  }

  const Icon = StudentUtils.subjectIcon(resource.subject)

  return (
    <div
      className={cn(
        "w-full overflow-hidden relative group border rounded-sm",
        color.bg,
        color.text,
        color.border,
      )}
    >
      <div
        className={cn(
          "flex flex-col h-full divide-y divide-inherit transition-opacity select-none pointer-events-none",
          {
            "group-hover:opacity-0": !!setAssignments,
          },
        )}
      >
        <header className="px-2 pb-2 pt-1.5">
          <span className="text-xs font-semibold line-clamp-1 mb-1.5 flex items-center gap-1">
            <Icon size={12} />
            {tSubject(resource.subject)}
          </span>
          <h3 className="text-xs font-medium whitespace-nowrap text-ellipsis line-clamp-1">
            {resource?.title}
          </h3>
          <p className="text-xs line-clamp-1">{resource.press}</p>
        </header>

        <p
          className={cn(
            "grow flex items-center justify-center text-xs px-2 py-1",
            color.content,
          )}
        >
          {item.questionCount} questions
        </p>
      </div>

      <IfValue
        value={setAssignments}
        renderItem={(set) => (
          <div
            className="absolute inset-0 flex flex-col cursor-pointer select-none items-center gap-0.5 justify-center opacity-0 transition-opacity group-hover:opacity-100 "
            onClick={() =>
              set((assignments) =>
                assignments.filter(
                  ({ resourceId }) => resourceId !== item.resourceId,
                ),
              )
            }
          >
            <XIcon />
            <p className="text-sm font-medium">Delete</p>
          </div>
        )}
      />
    </div>
  )
}

const subjectColors: Record<
  string,
  { bg: string; text: string; content: string; border: string }
> = {
  // Middle School
  "social-studies": {
    bg: "bg-yellow-100",
    text: "text-yellow-900",
    content: "bg-yellow-200/50",
    border: "border-yellow-600/25 divide-yellow-600/25",
  },
  science: {
    bg: "bg-sky-100",
    text: "text-sky-900",
    content: "bg-sky-200/50",
    border: "border-sky-600/25 divide-sky-600/25",
  },

  // High School
  physics: {
    bg: "bg-indigo-100",
    text: "text-indigo-900",
    content: "bg-indigo-200/50",
    border: "border-indigo-600/25 divide-indigo-600/25",
  },
  chemistry: {
    bg: "bg-fuchsia-100",
    text: "text-fuchsia-900",
    content: "bg-fuchsia-200/50",
    border: "border-fuchsia-600/25 divide-fuchsia-600/25",
  },
  biology: {
    bg: "bg-green-100",
    text: "text-green-900",
    content: "bg-green-200/50",
    border: "border-green-600/25 divide-green-600/25",
  },
  history: {
    bg: "bg-amber-100",
    text: "text-amber-900",
    content: "bg-amber-200/50",
    border: "border-amber-600/25 divide-amber-600/25",
  },
  geography: {
    bg: "bg-teal-100",
    text: "text-teal-900",
    content: "bg-teal-200/50",
    border: "border-teal-600/25 divide-teal-600/25",
  },
  geometry: {
    bg: "bg-rose-100",
    text: "text-rose-900",
    content: "bg-rose-200/50",
    border: "border-rose-600/25 divide-rose-600/25",
  },

  // Shared
  turkish: {
    bg: "bg-orange-100",
    text: "text-orange-900",
    content: "bg-orange-200/50",
    border: "border-orange-600/25 divide-orange-600/25",
  },
  english: {
    bg: "bg-orange-100",
    text: "text-orange-900",
    content: "bg-orange-200/50",
    border: "border-orange-600/25 divide-orange-600/25",
  },
  math: {
    bg: "bg-gray-100",
    text: "text-gray-900",
    content: "bg-gray-200/50",
    border: "border-gray-600/25 divide-gray-600/25",
  },
}
