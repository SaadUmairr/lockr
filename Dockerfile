FROM node:24-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

COPY prisma ./
COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD  [ "pnpm", "run", "start" ]