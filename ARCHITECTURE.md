# Patterns Architecture Overview

Patterns is built as a modular, enterprise-grade, headless Web-to-Print SaaS platform using a monorepo structure managed by Turborepo.

## Monorepo Layout

```
apps/
├── api/          # NestJS Headless API Gateway & Business Modules
├── cms/          # Next.js Admin CMS Portal
├── website/      # Next.js Storefront Application
├── editor/       # Next.js Web-to-Print Canvas Editor
└── worker/       # NestJS Background Queue Worker (BullMQ)

packages/
├── constants/    # Centralized application constants
├── types/        # TypeScript utility types
├── utils/        # General-purpose helper utilities
├── validation/   # Shared Zod validation schemas
├── errors/       # Standardized error codes & exception classes
├── logger/       # Application logging abstraction
├── storage/      # Storage Provider interfaces
├── storage-minio/# MinIO S3 implementation of StorageProvider
├── events/       # Domain event interfaces
├── permissions/  # RBAC scope & role contracts
├── prisma/       # PostgreSQL Prisma database schema & client
├── sdk/          # Client SDK placeholder
├── hooks/        # React hooks placeholder
└── ui/           # Shared Component Library (Tailwind v4)
```

## Dependency Direction
`Apps → Client → Packages (validation → utils → types → constants)`
Reverse imports across levels are strictly prohibited.
