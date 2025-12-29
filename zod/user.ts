import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "../db/schema";

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
