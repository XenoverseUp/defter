import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./page";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LocationSelector from "@/components/ui/location-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircleIcon, ShapesIcon, SigmaIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface Props {
  form: UseFormReturn<FormSchema>;
  onSubmit: (values: FormSchema) => void;
  loading: boolean;
}

export default function CreateStudentForm({ form, onSubmit, loading }: Props) {
  const t = useTranslations("CreateStudent.form");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("firstName.label")} *</FormLabel>
                  <FormControl>
                    <Input placeholder="Muhammed Can" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("lastName.label")} *</FormLabel>
                  <FormControl>
                    <Input placeholder="Durmus" type="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("grade.label")} *</FormLabel>
              <FormDescription>{t("grade.description")}</FormDescription>
              <FormMessage />
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid h-14 grid-cols-2 gap-4 pt-2">
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:ring-2 [&:has([data-state=checked])>div]:bg-sky-50 [&:has([data-state=checked])>div]:text-sky-900">
                    <FormControl>
                      <RadioGroupItem value="middle-school" className="sr-only" />
                    </FormControl>

                    <Button asChild type="button" variant="outline" className="size-full ring-sky-500 justify-start pl-4!">
                      <div>
                        <ShapesIcon /> {t("grade.middle-school")}
                      </div>
                    </Button>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:ring-2 [&:has([data-state=checked])>div]:bg-orange-50 [&:has([data-state=checked])>div]:text-orange-900">
                    <FormControl>
                      <RadioGroupItem value="high-school" className="sr-only" />
                    </FormControl>
                    <Button asChild type="button" variant="outline" className="size-full ring-orange-500 justify-start pl-4!">
                      <div>
                        <SigmaIcon />
                        {t("grade.high-school")}
                      </div>
                    </Button>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("location.label")}</FormLabel>
              <FormControl>
                <LocationSelector
                  onCountryChange={(country) => {
                    form.setValue(field.name, [country?.iso2 || "", ""]);
                  }}
                  onStateChange={(state) => {
                    form.setValue(field.name, [form.getValues(field.name)?.[0] || "", state?.name || ""]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>{t("phone.label")}</FormLabel>
              <FormControl className="w-full">
                <PhoneInput placeholder="555 090 74 80" {...field} defaultCountry="TR" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("notes.label")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("notes.placeholder")} className="resize-none" {...field} />
              </FormControl>
              <FormDescription>{t("notes.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex items-center gap-2">
          <Button type="submit" disabled={loading}>
            <PlusCircleIcon />
            {loading ? t("creating") : t("create")}
          </Button>
          <Button type="button" variant="link" asChild className={cn({ "pointer-events-none": loading })}>
            <Link href="/dashboard">{t("cancel")}</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
