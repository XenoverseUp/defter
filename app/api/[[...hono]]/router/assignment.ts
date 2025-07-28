import * as schema from "@/db/schema"
import { zValidator } from "@hono/zod-validator"
import { eq, inArray, sql } from "drizzle-orm"

import { db } from "@/db"
import { and } from "drizzle-orm"
import { Hono } from "hono"
import { getAuth } from "../middleware/getAuth"
import { createAssignmentSchema } from "../validator/assignment"
import { requireOwnsStudent } from "../middleware/requireOwnsStudent"
import { doesUserOwnStudent } from "@/lib/actions/students"

import { studentIdParamSchema } from "../validator/student"
import {
  getActiveAssignment,
  getPastAssignments,
} from "@/lib/actions/assignments"

export const assignmentRouter = new Hono()
  .use(getAuth)
  .post("/", zValidator("json", createAssignmentSchema), async (c) => {
    const { user } = c.var
    const { studentId, startsOn, days = [], resourceSet } = c.req.valid("json")

    if (!(await doesUserOwnStudent(user.id, studentId)))
      return c.json({ error: "Student not found or not yours" }, 403)

    const hasActive = await db
      .select({ id: schema.assignment.id })
      .from(schema.assignment)
      .where(
        and(
          eq(schema.assignment.studentId, studentId),
          eq(schema.assignment.active, true),
        ),
      )

    if (hasActive.length > 0)
      return c.json(
        {
          error: "Student already has an active assignment. Validate first.",
        },
        400,
      )

    const ownedResources = await db.query.resource.findMany({
      where: and(
        inArray(schema.resource.id, Array.from(resourceSet)),
        eq(schema.resource.studentId, studentId),
      ),
      columns: { id: true },
    })

    const ownedResourceIds = new Set(ownedResources.map((r) => r.id))
    const hasUnownedResources = Array.from(resourceSet).some(
      (id) => !ownedResourceIds.has(id),
    )

    if (hasUnownedResources)
      return c.json(
        { error: "Some resources are not owned by the student" },
        403,
      )

    await db.transaction(async (tx) => {
      const [assignment] = await tx
        .insert(schema.assignment)
        .values({
          studentId,
          startsOn,
          active: true,
        })
        .returning()

      for (const day of days) {
        const [assignmentDay] = await tx
          .insert(schema.assignmentDay)
          .values({
            assignmentId: assignment.id,
            day: day.day,
          })
          .returning()

        await tx.insert(schema.assignmentEntry).values(
          day.assignments.map((entry) => ({
            assignmentDayId: assignmentDay.id,
            resourceId: entry.resourceId,
            assignedQuestions: entry.questionCount,
            solvedQuestions: 0,
          })),
        )
      }
    })

    return c.json({ success: true }, 201)
  })

  // Assignments Metadata
  .get(
    `/:studentId`,
    zValidator("param", studentIdParamSchema),
    requireOwnsStudent,
    async (c) => {
      const { student } = c.var

      const assignments = await getPastAssignments(student.id)

      return c.json({ success: true, data: assignments })
    },
  )

  // Active Assignment Data
  .get(
    `/:studentId/active`,
    zValidator("param", studentIdParamSchema),
    requireOwnsStudent,
    async (c) => {
      const { student } = c.var

      const activeAssignment = await getActiveAssignment(student.id)

      return c.json({
        success: activeAssignment ? true : false,
        data: activeAssignment,
      })
    },
  )

// Single Assignment Data
// .get("/:studentId/:assignmentId")
