# -----------------------------------------------------------------------------
# Patterns Worker - Production Dockerfile
# -----------------------------------------------------------------------------

FROM node:26-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune @patterns/worker --docker

FROM node:26-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm run build --filter @patterns/worker

FROM node:26-alpine AS runner
LABEL org.opencontainers.image.title="Patterns Worker" \
      org.opencontainers.image.description="Patterns Background Queue Worker Application"

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 workerjs

COPY --from=installer --chown=workerjs:nodejs /app/apps/worker/dist ./dist
COPY --from=installer --chown=workerjs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=workerjs:nodejs /app/apps/worker/package.json ./package.json

USER workerjs

STOPSIGNAL SIGTERM

CMD ["node", "dist/main.js"]
