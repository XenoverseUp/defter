import { db } from "@/db"
import * as schema from "@/db/schema"
import { sql, eq, and } from "drizzle-orm"
import { doesUserOwnStudent } from "./students"

export async function getPastAssignments(studentId: string, userId?: string) {
  if (userId) {
    const hasStudent = await doesUserOwnStudent(userId, studentId)
    if (!hasStudent) return []
  }

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
        eq(schema.assignment.studentId, studentId),
        eq(schema.assignment.active, false),
      ),
    )
    .groupBy(
      schema.assignment.id,
      schema.assignment.startsOn,
      schema.assignment.isValidated,
    )

  return assignments
}

export async function getActiveAssignment(studentId: string, userId?: string) {
  if (userId) {
    const hasStudent = await doesUserOwnStudent(userId, studentId)
    if (!hasStudent) return undefined
  }

  const assignment = await db.query.assignment.findFirst({
    where: and(
      eq(schema.assignment.studentId, studentId),
      eq(schema.assignment.active, true),
    ),
    columns: { id: true, isValidated: true, startsOn: true },
    with: {
      days: {
        columns: {
          assignmentId: false,
          createdAt: false,
        },
        with: {
          entries: {
            columns: {
              assignmentDayId: false,
              createdAt: false,
              solvedQuestions: false,
            },
          },
        },
      },
    },
  })

  if (!assignment) return undefined

  const totalAssignedQuestions = assignment.days.reduce(
    (sum, day) =>
      sum +
      day.entries.reduce(
        (entrySum, entry) => entrySum + entry.assignedQuestions,
        0,
      ),
    0,
  )

  return {
    ...assignment,
    totalAssignedQuestions,
  }
}
