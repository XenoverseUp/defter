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

interface Props {
  form: UseFormReturn<FormSchema>;
  onSubmit: (values: FormSchema) => void;
}

export default function CreateStudentForm({ form, onSubmit }: Props) {
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
                  <FormLabel>First Name *</FormLabel>
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
                  <FormLabel>Last Name *</FormLabel>
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
              <FormLabel>Grade *</FormLabel>
              <FormDescription>The grade of the students determines the study programs available.</FormDescription>
              <FormMessage />
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid h-14 grid-cols-2 gap-4 pt-2">
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:ring-2 [&:has([data-state=checked])>div]:bg-sky-50 [&:has([data-state=checked])>div]:text-sky-900">
                    <FormControl>
                      <RadioGroupItem value="middle-school" className="sr-only" />
                    </FormControl>

                    <Button asChild type="button" variant="outline" className="size-full ring-sky-500 justify-start pl-4!">
                      <div>
                        <ShapesIcon /> Middle School
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
                        High School
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
              <FormLabel>Location</FormLabel>
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl className="w-full">
                <PhoneInput placeholder="555 090 7480" {...field} defaultCountry="TR" />
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
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="The student is..." className="resize-none" {...field} />
              </FormControl>
              <FormDescription>You can take notes about the students.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex items-center gap-2">
          <Button type="submit">
            <PlusCircleIcon />
            Create Student
          </Button>
          <Button type="button" variant="link" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
