import { gradeEnum } from "@/db/schema"
import z from "zod"

export const deleteStudentsSchema = z.object({
  ids: z.array(z.uuid()),
})

export const studentIdParamSchema = z.object({
  studentId: z.uuid(),
})

export const createStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  grade: z.enum(gradeEnum.enumValues),
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const patchStudentSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  grade: z.enum(gradeEnum.enumValues).optional(),
})
