import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, uuid, pgEnum, integer, check } from "drizzle-orm/pg-core";

export const weekdayEnum = pgEnum("weekday", ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);

export const assignment = pgTable("assignment", {
  id: uuid("id").primaryKey().defaultRandom(),

  studentId: uuid("student_id")
    .notNull()
    .references(() => student.id, { onDelete: "cascade" }),

  startsOn: timestamp("starts_on", { mode: "date" }).notNull(),

  active: boolean("active").default(false).notNull(),
  isValidated: boolean("is_validated").default(false).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const assignmentDay = pgTable("assignment_day", {
  id: uuid("id").primaryKey().defaultRandom(),

  assignmentId: uuid("assignment_id")
    .notNull()
    .references(() => assignment.id, { onDelete: "cascade" }),

  day: weekdayEnum("day").notNull(), // enum: monday–sunday

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const assignmentEntry = pgTable("assignment_entry", {
  id: uuid("id").primaryKey().defaultRandom(),

  assignmentDayId: uuid("assignment_day_id")
    .notNull()
    .references(() => assignmentDay.id, { onDelete: "cascade" }),

  resourceId: uuid("resource_id")
    .notNull()
    .references(() => resource.id, { onDelete: "cascade" }),

  assignedQuestions: integer("assigned_questions").notNull(),
  solvedQuestions: integer("solved_questions").default(0).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const subjectEnum = pgEnum("subject", [
  // Middle School Only
  "social-studies",
  "science",

  // High School Only
  "physics",
  "chemistry",
  "biology",
  "history",
  "geography",
  "geometry",

  // Shared
  "turkish",
  "math",
  "english",
]);

export const resource = pgTable(
  "student_resource",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    studentId: uuid("student_id")
      .notNull()
      .references(() => student.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    subject: subjectEnum("subject").notNull(),
    press: text("press").notNull(),

    totalQuestions: integer("total_questions").notNull(),
    questionsRemaining: integer("questions_remaining").notNull(),

    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  ({ totalQuestions, questionsRemaining }) => [
    check("total_questions_non_negative", sql`${totalQuestions} > 0`),
    check("questions_remaining_non_negative", sql`${questionsRemaining} >= 0`),
    check("questions_remaining_not_more_than_total", sql`${questionsRemaining} <= ${totalQuestions}`),
  ],
);

export const gradeEnum = pgEnum("grade", ["middle-school", "high-school"]);

export const student = pgTable("student", {
  id: uuid("id").primaryKey().defaultRandom(),

  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  grade: gradeEnum("grade").notNull(),

  country: text("country"),
  city: text("district"),

  phone: text("phone"),
  notes: text("notes"),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()),
});

export const schema = {
  weekdayEnum,
  assignment,
  assignmentDay,
  assignmentEntry,
  student,
  user,
  session,
  account,
  verification,
  resource,
  gradeEnum,
  subjectEnum,
};
