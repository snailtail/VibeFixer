FROM node:20-alpine

WORKDIR /app

COPY backend ./backend
COPY frontend ./frontend

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["node", "backend/src/server.js"]
