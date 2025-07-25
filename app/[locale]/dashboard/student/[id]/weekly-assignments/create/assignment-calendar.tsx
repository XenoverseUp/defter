import { cn, DateUtils } from "@/lib/utils"
import { useStudentResources } from "@/lib/hooks/useResources"
import { useParams } from "next/navigation"
import { ReactNode, useContext } from "react"
import { Assignment, AssignmentContext } from "./page"
import CreateAssignmentForm from "./create-assignment-form"

import {
  AtomIcon,
  BookTypeIcon,
  ConeIcon,
  FlaskConicalIcon,
  LanguagesIcon,
  LeafIcon,
  MapIcon,
  PersonStandingIcon,
  PiIcon,
  SwordsIcon,
  XIcon,
} from "lucide-react"
import AssignmentCalendarSkeleton from "./assignment-calendar-skeleton"
import { useTranslations } from "next-intl"
import { subjectEnum } from "@/db/schema"

export default function AssignmentCalendar() {
  const { id } = useParams<{ id: string }>()
  const { assignments } = useContext(AssignmentContext)

  const { isLoading } = useStudentResources({ id })

  if (isLoading) return <AssignmentCalendarSkeleton />

  return (
    <div className="w-full min-h-90 grid grid-cols-7 grid-rows-1 rounded-lg divide-x border">
      {DateUtils.getCurrentWeekdates().map((date, i) => (
        <DayView
          key={`day-view-${i}`}
          index={i}
          date={date}
          items={assignments.filter(({ day }) => day === i)}
        >
          <CreateAssignmentForm
            title={DateUtils.format(date, {
              day: "numeric",
              weekday: "long",
              year: "numeric",
            })}
            day={i}
          />
        </DayView>
      ))}
    </div>
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
  const resource = data!.find(({ id }) => id === item.resourceId)

  const { setAssignments } = useContext(AssignmentContext)

  if (!resource) return

  const color = subjectColors[resource.subject] ?? {
    bg: "bg-muted",
    text: "text-foreground",
    content: "bg-muted/50",
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden relative group border rounded-sm",
        color.bg,
        color.text,
        color.border,
      )}
    >
      <div className="flex flex-col h-full divide-y divide-inherit transition-opacity group-hover:opacity-0 select-none pointer-events-none">
        <header className="px-2 pb-2 pt-1.5">
          <span className="text-xs font-semibold line-clamp-1 mb-1.5 flex items-center gap-1">
            {
              subjectIconMap[
                resource.subject as (typeof subjectEnum.enumValues)[number]
              ]
            }
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
      <div
        className="absolute inset-0 flex flex-col cursor-pointer select-none items-center gap-0.5 justify-center opacity-0 transition-opacity group-hover:opacity-100 "
        onClick={() =>
          setAssignments((assignments) =>
            assignments.filter(
              ({ resourceId }) => resourceId !== item.resourceId,
            ),
          )
        }
      >
        <XIcon />
        <p className="text-sm font-medium">Delete</p>
      </div>
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

const subjectIconMap: Record<
  (typeof subjectEnum.enumValues)[number],
  ReactNode
> = {
  turkish: <BookTypeIcon size={12} />,
  english: <LanguagesIcon size={12} />,
  math: <PiIcon size={12} />,
  "social-studies": <PersonStandingIcon size={12} />,
  science: <FlaskConicalIcon size={12} />,
  geometry: <ConeIcon size={12} />,
  physics: <AtomIcon size={12} />,
  chemistry: <FlaskConicalIcon size={12} />,
  biology: <LeafIcon size={12} />,
  history: <SwordsIcon size={12} />,
  geography: <MapIcon size={12} />,
}
