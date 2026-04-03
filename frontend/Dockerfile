# frontend/Dockerfile

FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ── Development stage ─────────────────────────────────────────────────────────
FROM base AS development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ── Build stage ───────────────────────────────────────────────────────────────
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# ── Production stage: serve with nginx ───────────────────────────────────────
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]