FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
