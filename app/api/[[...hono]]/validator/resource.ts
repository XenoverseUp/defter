import { subjectEnum } from "@/db/schema"
import z from "zod"

export const createResourceSchema = z
  .object({
    title: z.string().min(1),
    subject: z.enum(subjectEnum.enumValues),
    press: z.string().min(1),
    totalQuestions: z.number().int().positive(),
    questionsRemaining: z.number().int().nonnegative(),
  })
  .refine((data) => data.questionsRemaining <= data.totalQuestions, {
    message: "Remaining questions cannot exceed total",
    path: ["questionsRemaining"],
  })

export const deleteResourceSchema = z.object({
  resourceId: z.uuid(),
})
