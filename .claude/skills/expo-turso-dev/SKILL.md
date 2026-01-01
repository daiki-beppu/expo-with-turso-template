---
name: expo-turso-dev
description: Expo + Turso + Drizzle ORMプロジェクトの開発コマンドと依存関係管理。アプリの実行、ライブラリのインストール、マイグレーション生成、キャッシュクリア、またはこのExpoプロジェクトの開発ワークフローコマンドについて質問された時に使用。
---

# Expo Turso Dev

Expo + Turso (LibSQL) + Drizzle ORMプロジェクトの開発コマンドと依存関係管理のクイックリファレンス。

## 開発コマンド

### 開発サーバーの起動

```bash
# プラットフォーム選択付きで開発サーバーを起動
npm start

# 特定のプラットフォームで起動
npm run ios        # iOSシミュレーター
npm run android    # Androidエミュレーター
npm run web        # Webブラウザ
```

### コード品質

```bash
# コードフォーマットとLint修正
npm run lint
```

### データベース操作

```bash
# データベースマイグレーション生成（src/db/schema.ts修正後）
npm run db:generate

# マイグレーションは次回アプリ起動時に自動適用される
# src/app/_layout.tsx内のDrizzleProviderによって実行
```

### キャッシュ管理

```bash
# Expoキャッシュをクリア（マイグレーションやビルドの問題時に有効）
npx expo start -c
```

## 依存関係のインストール

**重要: ライブラリ追加時は必ず`npx expo install`を使用してください。**

Expoのinstallコマンドは、プロジェクトのExpo SDKバージョン（~54.0.30）に基づいて互換性のあるバージョンを自動的に選択します。

### 正しい方法

```bash
npx expo install <package-name>

# 例
npx expo install react-native-maps
```

### 間違った方法（避けるべき）

```bash
# ❌ npm installを使わない
npm install react-native-maps

# ❌ yarn addを使わない
yarn add react-native-maps
```

**理由**: `npm install`や`yarn add`を直接使用すると、互換性のないパッケージバージョンがインストールされ、Expoビルドが壊れたりランタイムエラーが発生する可能性があります。`npx expo install`コマンドはSDKとの互換性を保証します。

## プロジェクトコンテキスト

このプロジェクトで使用している技術:
- **Expo Router**: `src/app/`でのファイルベースルーティング
- **Turso (LibSQL)**: クラウドデータベース同期（オプション、iOS/Androidのみ）
- **Drizzle ORM**: タイプセーフなデータベース操作
- **expo-sqlite**: ローカルSQLiteデータベース

データベースは2つのモードで動作:
- **ローカルモード**: 環境変数不要、SQLiteのみ
- **Tursoモード**: `EXPO_TURSO_DB_URL`と`EXPO_TURSO_DB_AUTH_TOKEN`が設定されている場合、クラウドと同期
