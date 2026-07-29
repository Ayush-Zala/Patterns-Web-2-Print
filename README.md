# Patterns

Patterns is an enterprise-grade, API-first, headless Web-to-Print SaaS platform.

## Architecture Overview

Modular monorepo architecture using Turborepo, NestJS for backend services, and Next.js for frontends.

## Repository Structure

- `apps/`: Applications (api, worker, cms, website, editor)
- `packages/`: Shared packages (ui, config, types, shared, api-client, eslint-config, typescript-config)
- `infrastructure/`: Deployment and docker configs
- `docs/`: Project documentation

## Prerequisites

- Node.js 22 LTS
- pnpm
- Docker Desktop (Required for local infrastructure)

## Getting Started

1. `git clone` the repository
2. `pnpm install`
3. Copy `infrastructure/docker/.env.example` to `infrastructure/docker/.env`
4. Start infrastructure: `.\infrastructure\scripts\start.ps1`
5. `pnpm dev`

## Docker Infrastructure Setup

The local development environment requires Docker to run the database, caches, and storage. All configuration is located in `infrastructure/docker/`.

### Helper Scripts (Run from root or scripts dir)

- `.\infrastructure\scripts\start.ps1`: Start all services
- `.\infrastructure\scripts\stop.ps1`: Stop all services
- `.\infrastructure\scripts\restart.ps1`: Restart all services
- `.\infrastructure\scripts\reset.ps1`: **DANGER!** Stop, delete containers, and wipe all volumes
- `.\infrastructure\scripts\logs.ps1 [service]`: Tail logs for all or a specific service
- `.\infrastructure\scripts\health.ps1`: Check service health statuses

### Infrastructure Services

| Service       | URL                     | Default Credentials                                  |
| ------------- | ----------------------- | ---------------------------------------------------- |
| PostgreSQL    | `localhost:5432`        | `patterns_user` / `patterns_password`                |
| Redis         | `localhost:6379`        | `patterns_redis_password`                            |
| MinIO (API)   | `localhost:9000`        | `patterns_admin` / `patterns_minio_password`         |
| MinIO Console | `http://localhost:9001` | `patterns_admin` / `patterns_minio_password`         |
| pgAdmin       | `http://localhost:5050` | `admin@patterns.local` / `patterns_pgadmin_password` |
| RedisInsight  | `http://localhost:5540` | N/A                                                  |

## Commands

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications and packages
- `pnpm lint`: Run ESLint across the monorepo
- `pnpm typecheck`: Run TypeScript compilation check
- `pnpm format`: Format codebase with Prettier
- `pnpm clean`: Clean cache and node_modules

## Environment Variables

See `.env.example` for required variables.

## Applications

- **api**: NestJS REST API
- **worker**: NestJS background worker
- **cms**: Next.js App Router for admin dashboard
- **website**: Next.js App Router for storefront
- **editor**: Next.js App Router for editor

## Packages

- **constants**: Centralized application constants & defaults
- **types**: Common generic utility types & interfaces
- **utils**: Framework-agnostic general utility functions
- **validation**: Shared Zod schemas & primitive validators
- **errors**: Standardized error codes & exception classes
- **logger**: Application logging abstraction (Console & Pino)
- **storage**: Storage Provider interface definitions
- **storage-minio**: MinIO S3 concrete implementation of StorageProvider
- **events**: Domain event & message bus contracts
- **permissions**: Scope & RBAC interfaces
- **prisma**: Single schema Prisma client & migrations
- **sdk**: JavaScript/TypeScript API client SDK
- **hooks**: Shared React hooks
- **ui**: Shared Tailwind CSS & Radix UI component library
- **api-client**: HTTP client abstraction
- **eslint-config**: Centralized ESLint configuration
- **typescript-config**: Centralized TSConfig base

## Development Standards

- Strict TypeScript enabled (`noImplicitAny`, `noImplicitOverride`, etc.)
- Strict ESLint rules (no `any`, no `console.log`)
- Monorepo independence (no inter-app dependencies)

## Completed Infrastructure Foundations (Phases 0.1 - 0.8)

- ✅ Monorepo & Docker Infrastructure
- ✅ NestJS & Next.js Core Foundations
- ✅ Database & Prisma ORM Foundation
- ✅ Shared Granular Library Ecosystem
- ✅ Redis, BullMQ & MinIO Infrastructure
- ✅ CI/CD Pipelines, Quality Gates & Security Baselines

## Roadmap

- **Phase 1.0**: Workspace Foundation & Multi-Tenancy
- **Phase 1.1**: Authentication & Identity
- **Phase 1.2**: User & Role Management
- **Phase 1.3**: CMS Admin Dashboard
- **Phase 2.0**: Product Catalog & Variants
- **Phase 3.0**: Web-to-Print Canvas Editor
