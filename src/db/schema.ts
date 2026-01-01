import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 1. users（ユーザー）
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(), // nanoidで生成
    displayName: text("display_name"),
    avatarIcon: text("avatar_icon").default("😊"),
    authProvider: text("auth_provider", {
      enum: ["apple", "anonymous"],
    }).notNull(),
    authProviderId: text("auth_provider_id"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    authIdx: index("idx_users_auth").on(
      table.authProvider,
      table.authProviderId,
    ),
  }),
);
