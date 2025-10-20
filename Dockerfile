# Use Node.js 20 Alpine base
FROM node:20-alpine

# Install essential build dependencies
RUN apk add --no-cache \
  python3 \
  g++ \
  git \
  libc6-compat \
  bash \
  curl \
  make

# Fix Corepack signature issue
ENV COREPACK_ENABLE_STRICT_VERIFY=false

# Enable corepack and pin pnpm version
RUN corepack enable && corepack prepare pnpm@9.10.0 --activate

# Set working directory
WORKDIR /app

# Copy workspace and package definitions
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/nestjs-backend/package.json ./apps/nestjs-backend/
COPY apps/nextjs-app/package.json ./apps/nextjs-app/
COPY packages ./packages

# ✅ Disable Husky prepare script before install
# This removes the "prepare" and "install:husky" lines from package.json
RUN sed -i '/"prepare":/d' package.json && sed -i '/"install:husky":/d' package.json

# Install dependencies (skip frozen lockfile if needed)
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build the project
RUN pnpm rebuild esbuild @swc/core sqlite3 --build-from-source && pnpm build

# Set runtime environment variables
ENV NODE_ENV=production
ENV NEXTJS_DIR=apps/nextjs-app
ENV PRISMA_DATABASE_URL=file:./db/main.db
ENV PUBLIC_ORIGIN=https://teable-teable-nneax4-899199-95-217-164-24.traefik.me/
ENV BRAND_NAME=Teable
ENV SECRET_KEY=defaultSecretKey

# Expose web port
EXPOSE 3000

# Start app
CMD ["pnpm", "start"]