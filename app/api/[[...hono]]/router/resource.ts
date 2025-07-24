import { Hono } from "hono"
import { getAuth } from "../middleware/getAuth"
import { db } from "@/db"
import { resource } from "@/db/schema"
import { eq } from "drizzle-orm"
import { zValidator } from "@hono/zod-validator"
import {
  createResourceSchema,
  deleteResourceSchema,
} from "../validator/resource"
import { doesUserOwnStudent } from "@/lib/actions/students"
import { getStudentResources } from "@/lib/actions/resources"
import { requireOwnsStudent } from "../middleware/requireOwnsStudent"
import { studentIdParamSchema } from "../validator/student"
import { Regex } from "../validator/utils"

export const resourceRouter = new Hono()
  .use(getAuth)

  .get(
    `/:studentId{${Regex.uuid}}`,
    zValidator("param", studentIdParamSchema),
    requireOwnsStudent,
    async (c) => {
      const student = c.var.student

      const resources = await getStudentResources(student.id)
      return c.json(resources)
    },
  )

  .post(
    `/:studentId{${Regex.uuid}}`,
    zValidator("param", studentIdParamSchema),
    requireOwnsStudent,
    zValidator("json", createResourceSchema),
    async (c) => {
      const { id: studentId } = c.var.student
      const body = c.req.valid("json")

      const [created] = await db
        .insert(resource)
        .values({
          studentId,
          ...body,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      return c.json({ success: true, resource: created })
    },
  )

  .delete(
    `/:resourceId{${Regex.uuid}}`,
    zValidator("param", deleteResourceSchema),
    async (c) => {
      const { user } = c.var
      const { resourceId } = c.req.valid("param")

      const [retrieved] = await db
        .select()
        .from(resource)
        .where(eq(resource.id, resourceId))
      if (!retrieved)
        return c.json({ success: false, message: "No such resource." }, 404)

      const doesUserOwn = await doesUserOwnStudent(user.id, retrieved.studentId)
      if (!doesUserOwn)
        return c.json(
          { success: false, message: "Resource doesn't belong to user." },
          403,
        )

      try {
        await db.delete(resource).where(eq(resource.id, resourceId))
        return c.json({
          success: true,
          message: `Resource ${resourceId} has been removed.`,
        })
      } catch {
        return c.json(
          { success: false, message: "Internal server error occured." },
          500,
        )
      }
    },
  )

export default resourceRouter
