# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このプロジェクトは、Turso (LibSQL) を使用したクラウドデータベース同期とDrizzle ORMを統合したExpoモバイルアプリテンプレートです。アプリは2つのモードをサポートします：
- **ローカルモード**: SQLiteのみ、環境変数不要
- **Tursoモード**: 認証情報が設定されている場合、ローカルSQLiteとTursoクラウドデータベースを同期

## 開発コマンド

開発コマンドとライブラリインストール方法については、`expo-turso-dev` スキル（`.claude/skills/expo-turso-dev`）を参照してください。

**重要**: ライブラリのインストールには必ず `npx expo install` を使用してください（`npm install` や `yarn add` は避ける）。

## アーキテクチャ

### データベース層 - デュアルモード動作

データベースの初期化は**3つのカスケード層**で行われます：

1. **SQLiteProvider** (`src/app/_layout.tsx:13-34`)
   - オプションの`libSQLOptions`でexpo-sqliteを初期化
   - `onInit`内: `EXPO_TURSO_DB_URL`と`EXPO_TURSO_DB_AUTH_TOKEN`の両方が設定されている場合のみ、条件付きで`db.syncLibSQL()`を呼び出す
   - エラーハンドリングをラップし、同期失敗時もアプリをクラッシュさせない
   - **重要**: Turso同期はiOS/Androidのみ - WebプラットフォームはLibSQLをサポートしない

2. **DrizzleProvider** (`src/db/drizzle-provider.tsx`)
   - `useMigrations(db, migrations)`でマイグレーションを実行
   - マイグレーション完了まで描画をブロック（`return null`）
   - マイグレーション失敗時はエラーをスロー
   - `useDrizzleStudio(expo)`でDrizzle Studioを初期化

3. **Database Instance** (`src/db/index.ts`)
   - 生の`expo` SQLite接続をエクスポート: `openDatabaseSync("expo-turso-template.db")`
   - クエリ用にDrizzleでラップされた`db`インスタンスをエクスポート

**重要なポイント**: アプリはTurso設定なしでローカルで動作します。環境変数はオプトイン機能としてクラウド同期を有効にします。

### スキーマとマイグレーション

- **スキーマ**: `src/db/schema.ts`はDrizzleのSQLite coreを使用してテーブルを定義
- **ヘルパー**: `src/db/colmun-helper.ts`は再利用可能なカラム定義を提供:
  - `id`: `expo-crypto`の`randomUUID()`を使用したUUIDプライマリキー
  - `timestamps`: 自動更新ロジック付きの`createdAt`と`updatedAt`
- **マイグレーション**: `npm run db:generate`で`src/db/migrations/`に自動生成
- **設定**: `drizzle.config.ts`は`dialect: "sqlite"`と`driver: "expo"`を指定

**マイグレーションワークフロー**:
1. `src/db/schema.ts`を編集
2. `npm run db:generate`を実行
3. アプリを再起動 - DrizzleProviderによって次回起動時にマイグレーションが自動適用

### ルーティング

Expo Router（ファイルベースルーティング）を使用:
- `src/app/_layout.tsx` - プロバイダーを含むルートレイアウト
- `src/app/index.tsx` - ホーム画面
- `src/app/`にファイルを作成して新しいルートを追加

### パスエイリアス

TypeScriptとBabelはエイリアスで設定されています:
- `@/*` → `./src/*` (TypeScript + Babel)
- `@db` → `./src/db` (Babelのみ)

インポートでの使用例: `import { db } from '@db'`

## 環境変数

オプションです。Tursoクラウド同期にのみ必要:

```env
EXPO_TURSO_DB_URL=libsql://your-database-url.turso.io
EXPO_TURSO_DB_AUTH_TOKEN=your-auth-token-here
```

テンプレートは`.env.example`を参照してください。

## プラットフォーム考慮事項

- **iOS/Android**: Turso同期を完全サポート
- **Web**: Turso同期は非サポート（ネイティブ専用機能）。環境変数に関係なく、Webではローカルオンリーモードでアプリが動作

データベース機能を追加する際、Turso同期を使用する場合はネイティブプラットフォームでテストしてください。

## 重要な実装ノート

### データベース同期エラーハンドリング

`src/app/_layout.tsx`の`syncLibSQL()`呼び出しは以下でラップされています:
1. 環境変数チェック（未設定の場合はスキップ）
2. try-catchブロック（エラーをログ出力して続行）

**絶対に**同期を必須にしないでください - アプリはオフライン/ローカルオンリーで動作する必要があります。同期は機能強化であり、要件ではありません。

### Babelプラグイン設定

`.sql`拡張子をサポートする`babel-plugin-inline-import`により、DrizzleマイグレーションがExpoで動作します。このプラグインを削除するとマイグレーションが壊れます。

### TypeScript Strictモード

このプロジェクトはtsconfig.jsonで`"strict": true`を使用しています。すべての新しいコードは厳格なTypeScriptチェックに準拠する必要があります。
