FROM node:18.18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:18.18-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN apk add --no-cache curl

RUN npm install --legacy-peer-deps --omit=dev

EXPOSE 3000

ENTRYPOINT [ "npm" ]

CMD [ "start" ]