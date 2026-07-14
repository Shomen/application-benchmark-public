FROM grafana/k6:latest AS k6

FROM node:22-bookworm-slim AS base

WORKDIR /app

COPY --from=k6 /usr/bin/k6 /usr/bin/k6

COPY package*.json ./
RUN npm install -g npm@11.10.1 && npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]