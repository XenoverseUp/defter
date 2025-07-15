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

const formSchema = z.object({
  subject: z.string(),
  title: z.string().min(1).min(2).max(36),
  press: z.string().min(1).min(1).max(36),
  totalQuestions: z.number().min(10),
  remainingQuestions: z.number().min(0),
});

interface Props {
  grade: "middle-school" | "high-school";
}

export default function CreateResource({ grade }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusCircleIcon />
          Create Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <NotebookIcon className="size-6" />
            Create Resource
          </DialogTitle>
          <DialogDescription>Create resource in student profile to track their progress.</DialogDescription>
        </DialogHeader>

        <CreateResourceForm {...{ grade }} />
      </DialogContent>
    </Dialog>
  );
}

function CreateResourceForm({ grade }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      press: "",
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
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
                    Turkish
                  </SelectItem>
                  <SelectItem value="english">
                    <LanguagesIcon />
                    English
                  </SelectItem>
                  <SelectItem value="math">
                    <If condition={grade === "high-school"} renderItem={() => <PiIcon />} renderElse={() => <DivideIcon />} />
                    Math
                  </SelectItem>

                  <If
                    condition={grade === "middle-school"}
                    renderItem={() => (
                      <>
                        <SelectItem value="social-studies">
                          <PersonStandingIcon />
                          Social Studies
                        </SelectItem>
                        <SelectItem value="science">
                          <FlaskConicalIcon />
                          Science
                        </SelectItem>
                      </>
                    )}
                    renderElse={() => (
                      <>
                        <SelectItem value="geometry">
                          <ConeIcon />
                          Geometry
                        </SelectItem>
                        <SelectItem value="physics">
                          <AtomIcon />
                          Physics
                        </SelectItem>
                        <SelectItem value="chemistry">
                          <FlaskConicalIcon />
                          Chemistry
                        </SelectItem>
                        <SelectItem value="biology">
                          <LeafIcon />
                          Biology
                        </SelectItem>
                        <SelectItem value="history">
                          <SwordsIcon />
                          History
                        </SelectItem>
                        <SelectItem value="geography">
                          <MapIcon />
                          Geography
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
              name="remainingQuestions"
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
          <Button type="submit" className="">
            <PlusCircleIcon />
            Create Resource
          </Button>
        </div>
      </form>
    </Form>
  );
}
