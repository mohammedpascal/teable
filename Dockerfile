# Use Node.js 20 as base image
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Enable corepack for pnpm
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/nestjs-backend/package.json ./apps/nestjs-backend/
COPY apps/nextjs-app/package.json ./apps/nextjs-app/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Set environment variables
ENV NODE_ENV=production
ENV NEXTJS_DIR=apps/nextjs-app
ENV PRISMA_DATABASE_URL=file:./db/main.db
ENV PUBLIC_ORIGIN=http://localhost:3000
ENV BRAND_NAME=Teable
ENV SECRET_KEY=defaultSecretKey

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
