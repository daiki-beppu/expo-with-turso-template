import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

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
        await db.syncLibSQL();
      }}
    >
      <Stack />
    </SQLiteProvider>
  );
}
