---
name: expo-turso-dev
description: Development commands and dependency management for Expo + Turso + Drizzle ORM projects. Use when asked about running the app, installing libraries, generating migrations, clearing cache, or any development workflow commands in this Expo project.
---

# Expo Turso Dev

Quick reference for development commands and dependency management in Expo projects with Turso (LibSQL) and Drizzle ORM.

## Development Commands

### Starting the Development Server

```bash
# Start development server with platform selector
npm start

# Start for specific platform
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
```

### Code Quality

```bash
# Format code and fix linting issues
npm run lint
```

### Database Operations

```bash
# Generate database migrations (after modifying src/db/schema.ts)
npm run db:generate

# Migrations are automatically applied on next app launch
# via DrizzleProvider in src/app/_layout.tsx
```

### Cache Management

```bash
# Clear Expo cache (useful for migration or build issues)
npx expo start -c
```

## Dependency Installation

**Critical: Always use `npx expo install` for adding libraries.**

Expo's install command automatically selects compatible versions based on the project's Expo SDK version (~54.0.30).

### Correct Method

```bash
npx expo install <package-name>

# Example
npx expo install react-native-maps
```

### Incorrect Methods (Avoid)

```bash
# ❌ Don't use npm install
npm install react-native-maps

# ❌ Don't use yarn add
yarn add react-native-maps
```

**Why**: Using `npm install` or `yarn add` directly may install incompatible package versions that break the Expo build or cause runtime errors. The `npx expo install` command ensures SDK compatibility.

## Project Context

This project uses:
- **Expo Router**: File-based routing in `src/app/`
- **Turso (LibSQL)**: Cloud database sync (optional, iOS/Android only)
- **Drizzle ORM**: Type-safe database operations
- **expo-sqlite**: Local SQLite database

Database operates in two modes:
- **Local mode**: No environment variables required, SQLite only
- **Turso mode**: When `EXPO_TURSO_DB_URL` and `EXPO_TURSO_DB_AUTH_TOKEN` are set, syncs with cloud
