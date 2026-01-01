import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export const expo = openDatabaseSync("expo-turso-template.db"); // DB の名前を指定

export const db = drizzle(expo);
