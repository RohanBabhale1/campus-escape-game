# backend/Dockerfile
# Multi-stage: dev uses nodemon, prod uses plain node

FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ── Development stage ─────────────────────────────────────────────────────────
FROM base AS development
RUN npm install --include=dev
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# ── Production stage ──────────────────────────────────────────────────────────
FROM base AS production
COPY . .
EXPOSE 5000
# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
CMD ["npm", "start"]