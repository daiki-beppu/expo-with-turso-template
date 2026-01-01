# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo mobile app template that integrates Turso (LibSQL) for cloud database sync with Drizzle ORM. The app supports two modes:
- **Local mode**: SQLite only, no environment variables required
- **Turso mode**: Syncs local SQLite with Turso cloud database when credentials are set

## Development Commands

```bash
# Start development server
npm start
# Or platform-specific:
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser

# Format code and fix linting issues
npm run lint

# Generate database migrations (after modifying src/db/schema.ts)
npm run db:generate

# Clear cache (useful for migration or build issues)
npx expo start -c
```

## Architecture

### Database Layer - Dual Mode Operation

The database initialization happens in **three cascading layers**:

1. **SQLiteProvider** (`src/app/_layout.tsx:13-34`)
   - Initializes expo-sqlite with optional `libSQLOptions`
   - In `onInit`: conditionally calls `db.syncLibSQL()` only if both `EXPO_TURSO_DB_URL` and `EXPO_TURSO_DB_AUTH_TOKEN` are set
   - Wraps error handling so sync failures don't crash the app
   - **Critical**: Turso sync is iOS/Android only - web platform doesn't support LibSQL

2. **DrizzleProvider** (`src/db/drizzle-provider.tsx`)
   - Runs migrations using `useMigrations(db, migrations)`
   - Blocks rendering (`return null`) until migrations complete
   - Throws error if migrations fail
   - Initializes Drizzle Studio via `useDrizzleStudio(expo)`

3. **Database Instance** (`src/db/index.ts`)
   - Exports raw `expo` SQLite connection: `openDatabaseSync("expo-turso-template.db")`
   - Exports Drizzle-wrapped `db` instance for queries

**Key insight**: The app works locally without any Turso configuration. Environment variables enable cloud sync as an opt-in feature.

### Schema and Migrations

- **Schema**: `src/db/schema.ts` defines tables using Drizzle's SQLite core
- **Helpers**: `src/db/colmun-helper.ts` provides reusable column definitions:
  - `id`: UUID primary key using `expo-crypto`'s `randomUUID()`
  - `timestamps`: `createdAt` and `updatedAt` with auto-update logic
- **Migrations**: Auto-generated in `src/db/migrations/` via `npm run db:generate`
- **Config**: `drizzle.config.ts` specifies `dialect: "sqlite"` and `driver: "expo"`

**Migration workflow**:
1. Edit `src/db/schema.ts`
2. Run `npm run db:generate`
3. Restart app - migrations auto-apply on next launch via DrizzleProvider

### Routing

Uses Expo Router (file-based routing):
- `src/app/_layout.tsx` - Root layout with providers
- `src/app/index.tsx` - Home screen
- Add new routes by creating files in `src/app/`

### Path Aliases

TypeScript and Babel are configured with aliases:
- `@/*` → `./src/*` (TypeScript + Babel)
- `@db` → `./src/db` (Babel only)

Use in imports: `import { db } from '@db'`

## Environment Variables

Optional. Only required for Turso cloud sync:

```env
EXPO_TURSO_DB_URL=libsql://your-database-url.turso.io
EXPO_TURSO_DB_AUTH_TOKEN=your-auth-token-here
```

Reference `.env.example` for template.

## Platform Considerations

- **iOS/Android**: Full Turso sync support
- **Web**: Turso sync NOT supported (native-only feature). App will run in local-only mode on web regardless of env vars.

When adding database features, test on native platforms if using Turso sync.

## Critical Implementation Notes

### Database Sync Error Handling

The `syncLibSQL()` call in `src/app/_layout.tsx` is wrapped in:
1. Environment variable check (skip if not set)
2. Try-catch block (log error but continue)

**Never** make sync required - the app must work offline/local-only. Sync is an enhancement, not a requirement.

### Babel Plugin Configuration

The `babel-plugin-inline-import` with `.sql` extension support enables Drizzle migrations to work with Expo. Do not remove this plugin or migrations will break.

### TypeScript Strict Mode

This project uses `"strict": true` in tsconfig.json. All new code must comply with strict TypeScript checks.
