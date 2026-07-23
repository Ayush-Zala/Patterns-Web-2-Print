# Architecture Decision Records (ADR)

## ADR 001: Monorepo Architecture using Turborepo & pnpm Workspaces
- **Status**: Accepted
- **Context**: Need a unified codebase for 5 applications (`api`, `cms`, `website`, `editor`, `worker`) and shared packages.
- **Decision**: Use Turborepo with pnpm workspaces for fast, cached builds and strict dependency isolation.

## ADR 002: Storage Provider Dependency Inversion
- **Status**: Accepted
- **Context**: Need object storage with future elasticity across MinIO, S3, R2, or GCS.
- **Decision**: Interface contracts reside in `@patterns/storage`, concrete MinIO implementation resides in `@patterns/storage-minio`.

## ADR 003: Single Prisma Schema with Section Annotations
- **Status**: Accepted
- **Context**: Prisma `prismaSchemaFolder` is currently a preview feature.
- **Decision**: Maintain a single stable `schema.prisma` in `@patterns/prisma` with modular section comments.

## ADR 004: Separate Background Queue Worker Application
- **Status**: Accepted
- **Context**: Background jobs (asset rendering, thumbnail generation) should not block HTTP server event loops.
- **Decision**: Implement `apps/worker` as a dedicated BullMQ queue consumer service.
