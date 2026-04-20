FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-workspace.yaml package.json ./
COPY frontend/package.json ./frontend/

RUN pnpm install --filter frontend

COPY frontend ./frontend

ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_MAPS_API_KEY

ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
ENV VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

RUN pnpm --filter frontend build

# with nginx
FROM nginx:alpine
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80