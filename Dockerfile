# Use Debian-based Node.js (glibc) to avoid musl issues
FROM node:20-bookworm-slim

# Install essential build dependencies
RUN apt-get update && apt-get install -y \
  python3 \
  g++ \
  make \
  git \
  curl \
  && rm -rf /var/lib/apt/lists/*

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

# Disable Husky prepare scripts

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# ✅ Build project (no musl/glibc issues now)
RUN pnpm rebuild esbuild @swc/core sqlite3 && pnpm build

# Environment variables
ENV NODE_ENV=production
ENV NEXTJS_DIR=apps/nextjs-app
ENV PRISMA_DATABASE_URL=file:./db/main.db
ENV PUBLIC_ORIGIN=https://teable-teable-nneax4-899199-95-217-164-24.traefik.me/
ENV BRAND_NAME=Teable
ENV SECRET_KEY=defaultSecretKey

# Expose app port
EXPOSE 3000

# Start app
CMD ["pnpm", "start"]