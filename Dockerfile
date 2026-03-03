FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
ARG PACKAGES_TOKEN
COPY package.json bun.lock* ./
RUN test -n "$PACKAGES_TOKEN" || (echo "PACKAGES_TOKEN is required for private package install" && exit 1)
RUN printf "@olwiba:registry=https://npm.pkg.github.com\n@genesis:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\n" "$PACKAGES_TOKEN" > .npmrc && \
    bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.npmrc ./.npmrc
COPY . .
RUN bun run web:build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/content ./content
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["bun", "run", "start"]
