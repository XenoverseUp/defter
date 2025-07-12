"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import CreateStudentForm from "./create-student-form";
import { ScanEyeIcon, SignatureIcon, WholeWordIcon } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(1).min(3).max(32),
  lastName: z.string().min(1).min(2).max(32),
  grade: z.string(),
  location: z.tuple([z.string().min(1), z.string().optional()]).optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;

export default function Create() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      grade: undefined,
    },
  });

  function onSubmit(values: FormSchema) {
    try {
      console.log(values);
      toast.success("Form submittted succesfully.");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Tabs className="max-w-3xl space-y-10 mx-auto py-10" defaultValue="form">
      <header className="space-y-4">
        <div className="flex items-end gap-4 justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <SignatureIcon />
              Create Student
            </h1>
            <p className="text-sm text-muted-foreground">Create and preview a student entry to track their progress.</p>
          </div>
          <TabsList>
            <TabsTrigger value="form">
              <WholeWordIcon />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview">
              <ScanEyeIcon />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator />
      </header>
      <TabsContent value="form">
        <CreateStudentForm {...{ form, onSubmit }} />
      </TabsContent>
      <TabsContent value="preview">Preview amk!</TabsContent>
    </Tabs>
  );
}
