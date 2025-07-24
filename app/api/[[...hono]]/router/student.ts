import { Hono } from "hono"
import { getAuth } from "../middleware/getAuth"
import { getStudents } from "@/lib/actions/students"
import { zValidator } from "@hono/zod-validator"
import { student } from "@/db/schema"
import { and, eq, inArray } from "drizzle-orm"
import { db } from "@/db"
import {
  createStudentSchema,
  deleteStudentsSchema,
  patchStudentSchema,
  studentIdParamSchema,
} from "../validator/student"

import { requireOwnsStudent } from "../middleware/requireOwnsStudent"
import { Regex } from "../validator/utils"

export const studentRouter = new Hono()
  .use(getAuth)

  /* Students */

  .get("/", async (c) => {
    const { user } = c.var
    const students = await getStudents(user.id)

    return c.json(students)
  })

  .post("/", zValidator("json", createStudentSchema), async (c) => {
    const user = c.var.user

    const { firstName, lastName, grade, city, country, phone, notes } =
      c.req.valid("json")

    const inserted = (
      await db
        .insert(student)
        .values({
          firstName,
          lastName,
          grade,
          userId: user.id,
          country,
          city,
          phone,
          notes,
        })
        .returning()
    ).at(0)

    return c.json(inserted)
  })

  .delete("/", zValidator("json", deleteStudentsSchema), async (c) => {
    const user = c.var.user

    const { ids } = c.req.valid("json")

    const deleted = await db
      .delete(student)
      .where(and(eq(student.userId, user.id), inArray(student.id, ids)))
      .returning({ id: student.id })

    return c.json({ success: true, deleted })
  })

  .get(
    `/:studentId{${Regex.uuid}}`,
    zValidator("param", studentIdParamSchema),
    requireOwnsStudent,
    async (c) => {
      const params = c.req.valid("param")

      const profile = await db
        .select()
        .from(student)
        .where(eq(student.id, params.studentId))
        .limit(1)

      if (!profile.length)
        return c.json({ success: false, message: "Student not found." }, 404)

      return c.json(profile[0])
    },
  )

  .delete(
    `/:studentId{${Regex.uuid}}`,
    zValidator("param", studentIdParamSchema),
    requireOwnsStudent,
    async (c) => {
      const params = c.req.valid("param")

      const deleted = await db
        .delete(student)
        .where(eq(student.id, params.studentId))
        .returning({ id: student.id })

      if (deleted.length === 0) {
        return c.notFound()
      }

      return c.json({ success: true, deleted })
    },
  )

  .patch(
    `/:studentId{${Regex.uuid}}`,
    zValidator("param", studentIdParamSchema),
    requireOwnsStudent,
    zValidator("json", patchStudentSchema),
    async (c) => {
      const body = c.req.valid("json")
      const params = c.req.valid("param")
      const user = c.var.user

      if (!body.firstName && !body.lastName && !body.grade)
        return c.json(
          { success: true, message: "No fields to update provided" },
          200,
        )

      const { firstName, lastName, grade } = body

      const updated = await db
        .update(student)
        .set({
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(grade && { grade }),
        })
        .where(eq(student.id, params.studentId))
        .returning()

      if (updated.length === 0)
        return c.json({ success: false, message: "No such user found!" }, 404)

      return c.json({ success: true, data: updated[0] })
    },
  )
