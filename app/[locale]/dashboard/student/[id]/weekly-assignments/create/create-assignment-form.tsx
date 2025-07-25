import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { NumberInput } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subjectEnum } from "@/db/schema"
import { StudentResourceData } from "@/lib/client-services/resources"
import { useStudentResources } from "@/lib/hooks/useResources"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarDaysIcon, PlusIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { Fragment, useContext, useState } from "react"
import { useForm } from "react-hook-form"

import { useTranslations } from "next-intl"
import { z } from "zod"
import { AssignmentContext } from "./page"
import { If } from "@/components/ui/if"
import { cn } from "@/lib/utils"

const createAssignmentSchema = (
  resources: StudentResourceData[],
  assignedCounts: Record<string, number>,
) =>
  z
    .object({
      resourceId: z.uuid(),
      questionCount: z
        .number()
        .min(1, { message: "Assign at least 1 question." }),
    })
    .refine(
      (data) => {
        const selected = resources.find((r) => r.id === data.resourceId)
        const alreadyAssigned = assignedCounts[data.resourceId] || 0
        return selected
          ? data.questionCount + alreadyAssigned <= selected.questionsRemaining
          : false
      },
      {
        message:
          "Question count exceeds available questions for selected resource.",
        path: ["questionCount"],
      },
    )

export default function CreateAssignmentForm({
  title,
  day = 0,
}: {
  title: string
  day: number
}) {
  const tSubject = useTranslations("subject")
  const { id } = useParams<{ id: string }>()
  const { assignments, setAssignments } = useContext(AssignmentContext)

  const [open, setOpen] = useState(false)
  const { data } = useStudentResources({ id })
  const resources = data!

  const assignedCounts: Record<string, number> = {}
  for (const assignment of assignments) {
    assignedCounts[assignment.resourceId] =
      (assignedCounts[assignment.resourceId] || 0) + assignment.questionCount
  }

  const hasAssignableResources = resources.some((resource) => {
    const assigned = assignedCounts[resource.id] || 0
    return resource.questionsRemaining - assigned > 0
  })

  const form = useForm({
    resolver: zodResolver(createAssignmentSchema(resources, assignedCounts)),
    defaultValues: {
      questionCount: 1,
      resourceId: undefined,
    },
  })

  const selectedResourceId = form.watch("resourceId")

  async function onSubmit(
    values: z.infer<ReturnType<typeof createAssignmentSchema>>,
  ) {
    setAssignments([
      ...assignments,
      { ...values, day, id: crypto.randomUUID() },
    ])
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (open) form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("shadow-none", {
            hidden: !hasAssignableResources,
          })}
        >
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 border-none!">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <CalendarDaysIcon /> {title}
          </DialogTitle>
          <DialogDescription>
            Create resource in student profile to track their progress.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-6"
          >
            <FormField
              control={form.control}
              name="resourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="justify-between">
                    Resource
                    <If
                      condition={!!selectedResourceId}
                      renderItem={() => {
                        const res = resources.find(
                          (r) => r.id === selectedResourceId,
                        )!
                        const alreadyAssigned =
                          assignedCounts[selectedResourceId] || 0
                        return (
                          <span className="flex items-center shrink-0 py-1 rounded-md gap-1 text-muted-foreground text-xs">
                            {res.questionsRemaining - alreadyAssigned} questions
                            remaining.
                          </span>
                        )
                      }}
                    />
                  </FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val)
                      form.setValue("questionCount", 1)
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select one of the resources." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjectEnum.enumValues.map((subject) => {
                        const resourceList = resources.filter((resource) => {
                          const assigned = assignedCounts[resource.id] || 0
                          const remaining =
                            resource.questionsRemaining - assigned
                          return resource.subject === subject && remaining > 0
                        })

                        if (!resourceList.length) return null

                        return (
                          <Fragment key={`assignment-${day}-${subject}`}>
                            <SelectSeparator className="first:hidden" />
                            <SelectGroup>
                              <SelectLabel>{tSubject(subject)}</SelectLabel>
                              {resourceList.map((resource) => {
                                return (
                                  <SelectItem
                                    key={`assignment-item-${day}-${resource.id}`}
                                    value={resource.id}
                                  >
                                    {resource.title}
                                  </SelectItem>
                                )
                              })}
                            </SelectGroup>
                          </Fragment>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionCount"
              render={({ field }) => {
                const selected = resources.find(
                  ({ id }) => selectedResourceId === id,
                )
                const alreadyAssigned = assignedCounts[selectedResourceId] || 0
                const isDisabled = !selectedResourceId

                return (
                  <FormItem>
                    <FormLabel>Question Count</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        max={
                          selected
                            ? selected.questionsRemaining - alreadyAssigned
                            : undefined
                        }
                        onValueChange={field.onChange}
                        disabled={isDisabled}
                        format="%d questions"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <Button type="submit" className="ml-auto w-full">
              Add Assignment
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
