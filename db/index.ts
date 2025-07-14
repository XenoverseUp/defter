import { drizzle } from "drizzle-orm/neon-http";

import { schema } from "./schema";

export const db = drizzle({
  connection: process.env.DB_URL!,
  schema,
});
