import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NumberInput } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subjectEnum } from "@/db/schema";
import { StudentResourceData } from "@/lib/client-services/resources";
import { useStudentResources } from "@/lib/hooks/useResources";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDaysIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Fragment, ReactNode, useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";
import { z } from "zod";
import { AssignmentContext } from "./page";
import { If } from "@/components/ui/if";

const createAssignmentSchema = (resources: StudentResourceData[]) =>
  z
    .object({
      resourceId: z.uuid(),
      questionCount: z.number().min(1, { message: "Assign at least 1 question." }),
    })
    .refine(
      (data) => {
        const selected = resources.find((r) => r.id === data.resourceId);
        return selected ? data.questionCount <= selected.questionsRemaining : false;
      },
      {
        message: "Question count exceeds available questions for selected resource.",
        path: ["questionCount"],
      },
    );

export default function CreateAssignmentForm({ title, day = 0, children }: { title: string; day: number; children: ReactNode }) {
  const tSubject = useTranslations("subject");

  const { id } = useParams<{ id: string }>();
  const { assignments, setAssignments } = useContext(AssignmentContext);

  const [open, setOpen] = useState(false);

  const { data } = useStudentResources({ id });
  const resources = data!;

  const form = useForm({
    resolver: zodResolver(createAssignmentSchema(resources)),
    defaultValues: {
      questionCount: 1,
    },
  });

  const selectedResourceId = form.watch("resourceId");

  async function onSubmit(values: z.infer<ReturnType<typeof createAssignmentSchema>>) {
    setAssignments([...assignments, { ...values, day }]);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) form.reset();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-6 border-none!">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <CalendarDaysIcon /> {title}
          </DialogTitle>
          <DialogDescription>Create resource in student profile to track their progress.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="resourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="justify-between">
                    Resource
                    <If
                      condition={!!selectedResourceId}
                      renderItem={() => (
                        <span className="flex items-center shrink-0 py-1 rounded-md gap-1 text-muted-foreground text-xs">
                          {resources.find(({ id }) => selectedResourceId === id)?.questionsRemaining} questions remaining.
                        </span>
                      )}
                    />
                  </FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("questionCount", 1);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select one of the resources." />{" "}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjectEnum.enumValues.map((subject) => {
                        const resourceList = resources.filter(
                          (resource) =>
                            resource.subject === subject &&
                            resource.questionsRemaining > 0 &&
                            !assignments.map((a) => a.resourceId).includes(resource.id),
                        );

                        if (!resourceList.length) return null;

                        return (
                          <Fragment key={`assignment-${day}-${subject}`}>
                            <SelectSeparator className="first:hidden" />
                            <SelectGroup>
                              <SelectLabel>{tSubject(subject)}</SelectLabel>
                              {resourceList.map((resource) => (
                                <SelectItem key={`assignment-item-${day}-${resource.id}`} value={resource.id}>
                                  {resource.title}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </Fragment>
                        );
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
                const selectedResourceId = form.watch("resourceId");
                const isDisabled = !selectedResourceId;

                return (
                  <FormItem>
                    <FormLabel>Question Count</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        max={resources.find(({ id }) => selectedResourceId === id)?.questionsRemaining}
                        onValueChange={field.onChange}
                        disabled={isDisabled}
                        format="%d questions"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button type="submit" className="ml-auto w-full">
              Add Assignment
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
