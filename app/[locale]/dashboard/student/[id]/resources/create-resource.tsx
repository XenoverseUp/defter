"use client";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AtomIcon,
  BookTypeIcon,
  ConeIcon,
  DivideIcon,
  FlaskConicalIcon,
  LanguagesIcon,
  LeafIcon,
  MapIcon,
  NotebookIcon,
  PersonStandingIcon,
  PiIcon,
  PlusCircleIcon,
  SwordsIcon,
} from "lucide-react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input, NumberInput } from "@/components/ui/input";
import { If } from "@/components/ui/if";
import { subjectEnum } from "@/db/schema";

import { useState } from "react";
import { createStudentResource } from "@/lib/client-services/resources";
import type { UUID } from "crypto";
import { mutateStudentResources } from "@/lib/hooks/useResources";

import { useTranslations } from "next-intl";

const formSchema = z
  .object({
    title: z.string().trim().min(1),
    subject: z.enum(subjectEnum.enumValues),
    press: z.string().trim().min(1),
    totalQuestions: z.number().int().positive(),
    questionsRemaining: z.number().int().nonnegative(),
  })
  .refine((data) => data.questionsRemaining <= data.totalQuestions, {
    message: "Remaining questions cannot exceed total.",
    path: ["questionsRemaining"],
  });

interface Props {
  grade: "middle-school" | "high-school";
  studentId: UUID | string;
}

export default function CreateResource({ grade, studentId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusCircleIcon />
          Create Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 border-none!">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <NotebookIcon className="size-6" />
            Create Resource
          </DialogTitle>
          <DialogDescription>Create resource in student profile to track their progress.</DialogDescription>
        </DialogHeader>

        <CreateResourceForm {...{ grade, studentId, setOpen }} />
      </DialogContent>
    </Dialog>
  );
}

function CreateResourceForm({ grade, studentId, setOpen }: Props & { setOpen: (v: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const tSubject = useTranslations("subject");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      press: "",
      title: "",
      totalQuestions: 0,
      questionsRemaining: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await mutateStudentResources(studentId, async (current = []) => {
        const created = await createStudentResource(studentId, values);
        return [created.resource, ...current];
      });

      toast.success("Resource created successfully.");
      setOpen(false);
    } catch (error) {
      const e = error as Error;
      toast.error(e.message ?? "Failed to submit the form.");
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject of the resource." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="turkish">
                    <BookTypeIcon />
                    {tSubject("turkish")}
                  </SelectItem>
                  <SelectItem value="english">
                    <LanguagesIcon />
                    {tSubject("english")}
                  </SelectItem>
                  <SelectItem value="math">
                    <If condition={grade === "high-school"} renderItem={() => <PiIcon />} renderElse={() => <DivideIcon />} />
                    {tSubject("math")}
                  </SelectItem>

                  <If
                    condition={grade === "middle-school"}
                    renderItem={() => (
                      <>
                        <SelectItem value="social-studies">
                          <PersonStandingIcon />
                          {tSubject("social-studies")}
                        </SelectItem>
                        <SelectItem value="science">
                          <FlaskConicalIcon />
                          {tSubject("science")}
                        </SelectItem>
                      </>
                    )}
                    renderElse={() => (
                      <>
                        <SelectItem value="geometry">
                          <ConeIcon />
                          {tSubject("geometry")}
                        </SelectItem>
                        <SelectItem value="physics">
                          <AtomIcon />
                          {tSubject("physics")}
                        </SelectItem>
                        <SelectItem value="chemistry">
                          <FlaskConicalIcon />
                          {tSubject("chemistry")}
                        </SelectItem>
                        <SelectItem value="biology">
                          <LeafIcon />
                          {tSubject("biology")}
                        </SelectItem>
                        <SelectItem value="history">
                          <SwordsIcon />
                          {tSubject("history")}
                        </SelectItem>
                        <SelectItem value="geography">
                          <MapIcon />
                          {tSubject("geography")}
                        </SelectItem>
                      </>
                    )}
                  />
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Petrucci Chemistry" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="press"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Press</FormLabel>
                  <FormControl>
                    <Input placeholder="Pearson" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="totalQuestions"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Total Questions</FormLabel>
                  <FormControl>
                    <NumberInput value={value} onValueChange={onChange} placeholder="500" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="questionsRemaining"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Remaining Questions</FormLabel>
                  <FormControl>
                    <NumberInput value={value} onValueChange={onChange} placeholder="300" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end mt-10">
          <DialogClose asChild>
            <Button type="button" variant="link" className="shrink-0">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            <PlusCircleIcon />
            <If condition={loading} renderItem={() => "Creating..."} renderElse={() => "Create Resource"} />
          </Button>
        </div>
      </form>
    </Form>
  );
}
