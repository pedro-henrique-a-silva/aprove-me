FROM node:18.18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/templates ./dist/src/templates
COPY --from=builder /app/prisma ./prisma

ENV DATABASE_URL="file:./prisma/dev.db"

RUN npm install --omit=dev

RUN npx prisma generate
RUN npx prisma db push --force-reset

EXPOSE 3001

CMD ["node", "dist/src/main"]