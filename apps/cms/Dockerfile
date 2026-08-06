# -----------------------------------------------------------------------------
# Patterns CMS - Production Dockerfile
# -----------------------------------------------------------------------------

FROM node:25-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune @patterns/cms --docker

FROM node:25-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm run build --filter @patterns/cms

FROM node:25-alpine AS runner
LABEL org.opencontainers.image.title="Patterns CMS" \
      org.opencontainers.image.description="Patterns Admin CMS Portal"

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/cms/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/cms/.next/static ./apps/cms/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/cms/public ./apps/cms/public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

STOPSIGNAL SIGTERM

CMD ["node", "apps/cms/server.js"]
