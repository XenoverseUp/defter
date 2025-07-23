import { drizzle } from "drizzle-orm/neon-http"

import { schema } from "./schema"
import "@/db/relations"

export const db = drizzle({
  connection: process.env.DB_URL!,
  schema,
})
