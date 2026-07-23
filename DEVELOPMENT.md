# Developer Setup Guide

## Local Prerequisites
- Node.js >= 20.x
- pnpm >= 9.x
- Docker & Docker Compose

## Quick Start
```bash
# 1. Install workspace dependencies
pnpm install

# 2. Start infrastructure services (Postgres, Redis, MinIO)
docker-compose up -d

# 3. Generate Prisma client
pnpm run build --filter @patterns/prisma

# 4. Start API development server
pnpm run dev --filter @patterns/api
```
