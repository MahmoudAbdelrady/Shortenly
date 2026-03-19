FROM node:22-alpine AS build

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy dependency files for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (cached unless lock file changes)
RUN pnpm install --frozen-lockfile

# Copy application source code
COPY . .

# Build the Angular SSR application
RUN pnpm build

FROM node:22-alpine

# Apply latest OS security patches
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Copy the built SSR output from the build stage
COPY --from=build /app/dist/shortenly/ ./

EXPOSE 4000

CMD ["node", "server/server.mjs"]
