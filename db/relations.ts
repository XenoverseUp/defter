import { relations } from "drizzle-orm"
import { assignment, assignmentDay, assignmentEntry } from "./schema"

export const assignmentRelations = relations(assignment, ({ many }) => ({
  days: many(assignmentDay),
}))

export const assignmentDayRelations = relations(assignmentDay, ({ many }) => ({
  entries: many(assignmentEntry),
}))
