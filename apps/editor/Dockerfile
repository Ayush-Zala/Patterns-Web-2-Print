# -----------------------------------------------------------------------------
# Patterns Editor - Production Dockerfile
# -----------------------------------------------------------------------------

FROM node:26-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune @patterns/editor --docker

FROM node:26-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm run build --filter @patterns/editor

FROM node:26-alpine AS runner
LABEL org.opencontainers.image.title="Patterns Editor" \
      org.opencontainers.image.description="Patterns Web-to-Print Canvas Editor Application"

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/editor/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/editor/.next/static ./apps/editor/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/editor/public ./apps/editor/public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

STOPSIGNAL SIGTERM

CMD ["node", "apps/editor/server.js"]
