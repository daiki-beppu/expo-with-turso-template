import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { DrizzleProvider } from "../db/drizzle-provider";

const dbSettings = {
  name: "expo-turso-template.db",
  url: process.env.EXPO_TURSO_DB_URL,
  authToken: process.env.EXPO_TURSO_DB_AUTH_TOKEN,
};

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName={dbSettings.name}
      options={{
        libSQLOptions: {
          url: dbSettings.url,
          authToken: dbSettings.authToken,
        },
      }}
      onInit={async (db: SQLiteDatabase) => {
        // Turso環境変数が設定されている場合のみ同期
        if (dbSettings.url && dbSettings.authToken) {
          try {
            await db.syncLibSQL();
            console.log("Turso sync completed");
          } catch (error) {
            console.error("Turso sync failed:", error);
            // 同期失敗してもアプリは続行（ローカルDBで動作）
          }
        } else {
          console.log("Running in local-only mode (Turso credentials not set)");
        }
      }}
    >
      <DrizzleProvider>
        <Stack />
      </DrizzleProvider>
    </SQLiteProvider>
  );
}
