FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY backend/package.json ./backend/package.json
WORKDIR /app/backend
RUN npm install --omit=dev

WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["node", "backend/src/server.js"]
