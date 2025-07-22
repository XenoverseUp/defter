import z from "zod";

const daySchema = z.object({
  day: z.number().int().min(0).max(6),
  assignments: z
    .array(
      z.object({
        resourceId: z.uuid(),
        questionCount: z.number().int().min(1),
      }),
    )
    .nonempty(),
});

export const createAssignmentSchema = z
  .object({
    studentId: z.uuid(),
    startsOn: z.coerce.date().refine((date) => date.getDay() === 1, { message: "Start date must be a Monday" }),
    days: z
      .array(daySchema)
      .nonempty({ message: "At least one day must be provided" })
      .refine(
        (days) => {
          const dayNumbers = days.map((d) => d.day);
          const uniqueDays = new Set(dayNumbers);
          return uniqueDays.size === dayNumbers.length;
        },
        { message: "Each day must be unique" },
      ),
  })
  .transform((data) => {
    const resourceIds = data.days.flatMap((d) => d.assignments.map((a) => a.resourceId));
    const resourceSet = new Set(resourceIds);

    if (resourceSet.size < 1) {
      throw new z.ZodError([
        {
          path: ["days"],
          message: "At least one resourceId must be provided across all days",
          code: "custom",
          input: data.days,
        },
      ]);
    }

    return {
      ...data,
      resourceSet,
    };
  });
