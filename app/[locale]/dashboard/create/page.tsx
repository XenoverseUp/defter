"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import CreateStudentForm from "./create-student-form";
import { ScanEyeIcon, SignatureIcon, WholeWordIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { createStudent } from "@/lib/client-services/students";
import { mutate } from "swr";
import { useRouter } from "@/i18n/navigation";

import { useState } from "react";

export type FormSchema = z.infer<ReturnType<typeof buildFormSchema>>;

function buildFormSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
    firstName: z
      .string()
      .min(3, { message: t("firstNameTooShort") })
      .max(32, { message: t("firstNameTooLong") }),

    lastName: z
      .string()
      .min(2, { message: t("lastNameTooShort") })
      .max(32, { message: t("lastNameTooLong") }),

    grade: z.string({ message: t("gradeRequired") }),

    location: z.tuple([z.string().min(1, { message: t("locationInvalid") }), z.string().optional()]).optional(),

    phone: z.string().optional(),
    notes: z.string().optional(),
  });
}

export default function Create() {
  const t = useTranslations("CreateStudent");
  const v = useTranslations("CreateStudent.form.validation");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const formSchema = buildFormSchema(v);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      grade: undefined,
    },
  });

  async function onSubmit(values: FormSchema) {
    setLoading(true);
    try {
      await mutate(
        "/api/students",
        async () => {
          await createStudent(values);
        },
        {
          optimisticData: (current = []) => [
            {
              ...values,
              id: `temp-${Date.now()}`,
            },
            ...current,
          ],
          rollbackOnError: true,
          revalidate: true,
        },
      );

      toast.success("Student created successfully.");
      router.push("/dashboard");
    } catch (error) {
      const e = error as Error;
      toast.error(e.message ?? "Failed to submit the form.");
      setLoading(false);
    }
  }

  return (
    <Tabs className="max-w-3xl space-y-10 mx-auto py-10" defaultValue="form">
      <header className="space-y-4">
        <div className="flex items-end gap-4 justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <SignatureIcon />
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <TabsList>
            <TabsTrigger value="form">
              <WholeWordIcon />
              {t("actions.edit")}
            </TabsTrigger>
            <TabsTrigger value="preview">
              <ScanEyeIcon />
              {t("actions.preview")}
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator />
      </header>
      <TabsContent value="form">
        <CreateStudentForm {...{ form, onSubmit, loading }} />
      </TabsContent>
      <TabsContent value="preview">Preview amk!</TabsContent>
    </Tabs>
  );
}
