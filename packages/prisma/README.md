# @patterns/prisma

This package provides the single source of truth for the database schema and the Prisma Client for the Patterns platform.

## Architecture

- **Single Schema**: We use a single `schema.prisma` file with clearly documented sections for each business module.
- **Client Singleton**: The Prisma Client is instantiated as a singleton in `src/client.ts` to prevent connection exhaustion.
- **Extensions**: We enable the PostgreSQL `pgcrypto` extension for `gen_random_uuid()` support.

## Conventions

- **Tables**: `snake_case`
- **Columns**: `snake_case`
- **Prisma Models**: `PascalCase`
- **Prisma Fields**: `camelCase`

Every business entity must implement:

- `id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid`
- `createdAt DateTime @default(now()) @map("created_at")`
- `updatedAt DateTime @updatedAt @map("updated_at")`
- `deletedAt DateTime? @map("deleted_at")` // For soft deletes
- `version Int @default(1)` // For optimistic locking

## Multi-Tenancy

Every business entity introduced in later phases will be evaluated for workspace ownership. Avoid prematurely adding `workspace_id` columns until the specific entity logic dictates it.

## Commands

- `pnpm run build`: Generates the Prisma client.
- `pnpm run db:migrate`: Creates and applies a new migration. Migration names should use Prisma's timestamped names plus descriptive names (e.g., `202607230945_initial_foundation`).
- `pnpm run db:push`: Pushes schema changes directly to the database (for prototyping, use `db:migrate` for production changes).
- `pnpm run db:seed`: Seeds the database using `prisma/seed/index.ts`.
- `pnpm run db:studio`: Opens Prisma Studio for local data inspection.
