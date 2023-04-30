FROM node:alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope="api-service" --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Build the project
COPY --from=builder /app/out/full/ .
RUN npm run build -- --filter='api-service'

FROM node:16-alpine as runner
WORKDIR /app
COPY --from=installer /app/ .
WORKDIR /app/apps/api-service

ENV DB_TYPE=$DB_TYPE
ENV DB_NAME=$DB_NAME

CMD ["npm", "run", "start:prod"]
