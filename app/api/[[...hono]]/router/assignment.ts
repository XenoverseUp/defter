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
import { Regex } from "../validator/utils"
import { studentIdParamSchema } from "../validator/student"

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
    `/:studentId{${Regex.uuid}}`,
    zValidator("param", studentIdParamSchema),
    requireOwnsStudent,
    async (c) => {
      const { student } = c.var

      const assignments = await db
        .select({
          id: schema.assignment.id,
          startsOn: schema.assignment.startsOn,
          validated: schema.assignment.isValidated,
          totalAssigned:
            sql<number>`COALESCE(SUM(${schema.assignmentEntry.assignedQuestions}), 0)`.as(
              "totalAssigned",
            ),
          totalSolved:
            sql<number>`COALESCE(SUM(${schema.assignmentEntry.solvedQuestions}), 0)`.as(
              "totalSolved",
            ),
          entryCount: sql<number>`COUNT(${schema.assignmentEntry.id})`.as(
            "entryCount",
          ),
        })
        .from(schema.assignment)
        .leftJoin(
          schema.assignmentDay,
          eq(schema.assignmentDay.assignmentId, schema.assignment.id),
        )
        .leftJoin(
          schema.assignmentEntry,
          eq(schema.assignmentEntry.assignmentDayId, schema.assignmentDay.id),
        )
        .where(
          and(
            eq(schema.assignment.studentId, student.id),
            eq(schema.assignment.active, false),
          ),
        )
        .groupBy(
          schema.assignment.id,
          schema.assignment.startsOn,
          schema.assignment.isValidated,
        )

      return c.json({ success: true, data: assignments })
    },
  )

  // Active Assignment Data
  .get(
    `/:studentId{${Regex.uuid}}/active`,
    zValidator("param", studentIdParamSchema),
    requireOwnsStudent,
    async (c) => {
      const { student } = c.var

      const activeAssignment = await db.query.assignment.findFirst({
        where: and(
          eq(schema.assignment.studentId, student.id),
          eq(schema.assignment.active, true),
        ),
        columns: { studentId: false },
        with: {
          days: {
            with: {
              entries: true,
            },
          },
        },
      })

      return c.json({ success: true, data: activeAssignment })
    },
  )

// Single Assignment Data
// .get("/:studentId/:assignmentId")
