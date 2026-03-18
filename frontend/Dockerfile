FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine
RUN apk update && apk upgrade --no-cache
WORKDIR /app
COPY --from=build /app/dist/shortenly/ ./
EXPOSE 4000
CMD ["node", "server/server.mjs"]
