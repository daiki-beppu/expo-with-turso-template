# Expo + Turso Template

Expo、Turso (LibSQL)、Drizzle ORM を使用したモバイルアプリテンプレートです。

## 特徴

- **Expo Router**: ファイルベースルーティング
- **Turso (LibSQL)**: クラウド SQLite データベース（オプション）
- **Drizzle ORM**: タイプセーフな ORM
- **expo-sqlite**: ローカル SQLite サポート
- **TypeScript**: 型安全な開発環境

## 前提条件

- Node.js 18 以降
- npm または yarn、bun
- iOS 開発には Xcode (macOS)
- Android 開発には Android Studio

## セットアップ手順

### 1. リポジトリをクローン

```bash
git clone <your-repo-url>
cd expo-with-turso-template
```

### 2. 依存関係をインストール

```bash
npm install
```

または

```bash
yarn install
# もしくは
bun install
```

### 3. アプリを起動（ローカルモード）

環境変数なしでローカル SQLite モードで起動できます：

```bash
npx expo start
```

起動後、以下の方法でアプリを開けます：

- `i` - iOS シミュレーター
- `a` - Android エミュレーター
- `w` - Web ブラウザ

### 4. Turso との同期を有効化（オプション）

クラウドデータベースとの同期が必要な場合は、以下の手順で Turso をセットアップします。

#### 4.1 Turso CLI をインストール

```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows
powershell -c "irm get.tur.so/install.ps1 | iex"
```

#### 4.2 Turso にログイン

```bash
turso auth login
```

#### 4.3 データベースを作成

```bash
turso db create expo-turso-template
```

#### 4.4 データベース URL とトークンを取得

```bash
# データベース URL を取得
turso db show expo-turso-template --url

# 認証トークンを作成
turso db tokens create expo-turso-template
```

#### 4.5 環境変数を設定

プロジェクトルートに `.env` ファイルを作成し、以下を追加：

```env
EXPO_TURSO_DB_URL=libsql://your-database-url.turso.io
EXPO_TURSO_DB_AUTH_TOKEN=your-auth-token-here
```

> **注意**: `.env` ファイルは `.gitignore` に含まれているため、Git にコミットされません。

#### 4.6 アプリを再起動

```bash
npx expo start
```

環境変数が設定されている場合、アプリは Turso と自動的に同期します。

## プロジェクト構造

```
expo-with-turso-template/
├── src/
│   ├── app/              # Expo Router のルート定義
│   │   ├── _layout.tsx   # ルートレイアウト（SQLite/Turso 初期化）
│   │   └── (tabs)/       # タブナビゲーション
│   └── db/
│       ├── schema.ts     # Drizzle スキーマ定義
│       ├── index.ts      # データベース接続
│       ├── migrations/   # マイグレーションファイル
│       └── drizzle-provider.tsx  # Drizzle プロバイダー
├── assets/               # 画像、フォントなどの静的ファイル
├── drizzle.config.ts     # Drizzle Kit 設定
└── package.json
```

## データベース

### スキーマの変更

1. `src/db/schema.ts` を編集してスキーマを変更
2. マイグレーションを生成：

```bash
npm run db:generate
```

3. アプリを再起動すると自動的にマイグレーションが適用されます

### ローカルモード vs Turso モード

このテンプレートは 2 つのモードで動作します：

#### ローカルモード（デフォルト）

- 環境変数なしで動作
- デバイス上の SQLite データベースのみ使用
- 開発に最適

#### Turso モード

- 環境変数を設定すると自動的に有効化
- ローカル SQLite と Turso クラウド DB を同期
- 本番環境やマルチデバイス同期に最適

## 利用可能なスクリプト

```bash
# 開発サーバーを起動
npm start

# 特定のプラットフォームで起動
npm run ios        # iOS シミュレーター
npm run android    # Android エミュレーター
npm run web        # Web ブラウザ

# コードフォーマット & Lint
npm run lint

# データベースマイグレーションを生成
npm run db:generate
```

## トラブルシューティング

### `syncLibSQL is not supported in the current environment` エラー

このエラーは以下の場合に発生します：

1. **Web で実行している**: Turso 同期は iOS/Android のみサポート
2. **環境変数未設定**: ローカルモードで動作します（エラーは表示されません）

### マイグレーションエラー

マイグレーションで問題が発生した場合：

```bash
# キャッシュをクリア
npx expo start -c
```

## 参考リンク

- [Expo ドキュメント](https://docs.expo.dev/)
- [Turso ドキュメント](https://docs.turso.tech/)
- [Drizzle ORM ドキュメント](https://orm.drizzle.team/)
- [expo-sqlite ドキュメント](https://docs.expo.dev/versions/latest/sdk/sqlite/)

## ライセンス

MIT
