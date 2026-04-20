FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/
COPY backend/package-lock.json ./backend/

RUN pnpm install --filter gully-ka-taste-backend

COPY backend ./backend

# Generate Prisma client
WORKDIR /app/backend
RUN npx prisma generate

EXPOSE 4000

CMD ["node", "src/index.js"]