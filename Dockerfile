FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY . .

CMD sh -c "npx prisma db push --accept-data-loss && npx ts-node src/index.ts"