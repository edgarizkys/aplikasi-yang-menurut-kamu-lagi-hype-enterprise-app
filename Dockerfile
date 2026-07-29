FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY server ./server

EXPOSE 3000

CMD ["npm", "start"]