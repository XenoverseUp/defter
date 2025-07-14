import { gradeEnum } from "@/db/schema";
import z from "zod";

export const deleteStudentsSchema = z.object({
  ids: z.array(z.uuid()),
});

export const studentIdParamSchema = z.object({
  id: z.uuid(),
});

export const createStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  grade: z.enum(gradeEnum.enumValues),
  location: z
    .tuple([
      z.string().min(1), // country
      z.string().optional(), // city
    ])
    .optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const patchStudentSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  grade: z.enum(gradeEnum.enumValues).optional(),
});
