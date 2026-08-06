# -----------------------------------------------------------------------------
# Patterns API - Production Dockerfile
# -----------------------------------------------------------------------------

# Stage 1: Build & Prune Monorepo
FROM node:25-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo

COPY . .
RUN turbo prune @patterns/api --docker

# Stage 2: Install Dependencies & Build Application
FROM node:25-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm run build --filter @patterns/api

# Stage 3: Production Runner
FROM node:25-alpine AS runner
LABEL org.opencontainers.image.title="Patterns API" \
      org.opencontainers.image.description="Patterns Headless Web-to-Print API Server" \
      org.opencontainers.image.source="https://github.com/patterns/patterns"

ENV NODE_ENV=production \
    PORT=4000

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=installer --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/package.json ./package.json

USER nestjs
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/v1/system/health || exit 1

STOPSIGNAL SIGTERM

CMD ["node", "dist/main.js"]
