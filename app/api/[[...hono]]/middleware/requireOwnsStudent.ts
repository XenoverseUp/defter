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
  try {
    const { studentId } = studentIdParamSchema.parse(c.req.param())

    const user = c.var.user
    if (!user) return c.json({ error: "Unauthorized" }, 401)

    const ownedStudent = await db.query.student.findFirst({
      where: (s, { eq, and }) =>
        and(eq(s.id, studentId), eq(s.userId, user.id)),
    })

    if (!ownedStudent) return c.notFound()

    c.set("student", ownedStudent)

    return await next()
  } catch (err) {
    console.error("requireOwnsStudent error", err)
    return c.json({ error: "Bad Request" }, 400)
  }
})
