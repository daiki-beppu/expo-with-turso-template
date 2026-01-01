import { sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { randomUUID } from "expo-crypto";

export const id = text("id")
  .primaryKey()
  .$defaultFn(() => randomUUID());

export const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
};
