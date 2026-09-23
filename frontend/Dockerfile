FROM node:24-alpine AS build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy dependency files for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (cached unless lock file changes)
RUN pnpm install --frozen-lockfile

# Copy application source code
COPY . .

# Build the Angular SSR application
RUN pnpm build

FROM node:24-alpine

# Cache-bust argument to force fresh OS patches on each build
ARG CACHE_BUST

# Apply latest OS security patches
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Copy the built SSR output from the build stage
COPY --from=build /app/dist/shortenly/ ./

EXPOSE 4000

CMD ["node", "server/server.mjs"]
