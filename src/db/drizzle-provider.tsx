import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { db, expo } from "../db";
import migrations from "../db/migrations/migrations";

type DrizzleProviderProps = {
  children: React.ReactNode;
};

export const DrizzleProvider = ({ children }: DrizzleProviderProps) => {
  const { success, error } = useMigrations(db, migrations);

  useDrizzleStudio(expo);

  // マイグレーションエラーの処理
  if (error) {
    console.error("Migration Error:", error);
    throw error;
  }

  // マイグレーション完了まで待機
  if (!success) {
    return null; // ローディング表示を検討
  }

  return <>{children}</>;
};
