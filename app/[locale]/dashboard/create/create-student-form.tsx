import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./page";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LocationSelector from "@/components/ui/location-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircleIcon } from "lucide-react";
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
                  <FormLabel>First Name</FormLabel>
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
                  <FormLabel>Last Name</FormLabel>
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
            <FormItem className="space-y-3">
              <FormLabel>Grade</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
                  {[
                    ["Middle School", "middle-school"],
                    ["High School", "high-school"],
                  ].map((option, index) => (
                    <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
                      <FormControl>
                        <RadioGroupItem value={option[1]} />
                      </FormControl>
                      <FormLabel className="font-normal">{option[0]}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormDescription>Select the student&apos;s grade.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select A City</FormLabel>
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
              <FormDescription>If your country has states, it will be appear after selecting country</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Phone number</FormLabel>
              <FormControl className="w-full">
                <PhoneInput placeholder="555 090 7480" {...field} defaultCountry="TR" />
              </FormControl>
              <FormDescription>Enter student&apos;s phone number.</FormDescription>
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
