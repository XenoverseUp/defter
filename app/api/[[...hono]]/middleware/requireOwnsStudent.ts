import { createMiddleware } from "hono/factory"

import { student } from "@/db/schema"

import { db } from "@/db"
import { User } from "better-auth"
import { studentIdParamSchema } from "../validator/student"

type Env = {
  Variables: {
    user: User
    student: typeof student.$inferSelect
  }
}

export const requireOwnsStudent = createMiddleware<Env>(async (c, next) => {
  const { studentId } = studentIdParamSchema.parse(c.req.param())

  const user = c.var.user
  if (!user) return c.json({ error: "Unauthorized" }, 401)

  const ownedStudent = await db.query.student.findFirst({
    where: (s, { eq }) => eq(s.id, studentId),
  })

  if (!ownedStudent) return c.notFound()

  if (ownedStudent.userId !== user.id)
    return c.json({ error: "Forbidden" }, 403)

  c.set("student", ownedStudent)

  await next()
})
