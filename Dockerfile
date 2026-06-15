FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY . .

CMD ["npx", "ts-node", "src/index.ts"]

#Stage 1: Build environment
FROM node:20-alpine AS build
WORKDIR /usr/src/app

#Install dependencies first to leverage Docker layer caching
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
RUN npm ci

#Copy the remaining source code
COPY . .

#Generate the Prisma client and compile TypeScript to JavaScript
RUN npm run prepare
RUN npm run build

#Stage 2: Production environment
FROM node:20-alpine AS final
WORKDIR /usr/src/app

ENV NODE_ENV=production

#Copy package manifests and the Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

#Install only production dependencies
RUN npm ci --omit=dev

#Explicitly install the Prisma CLI to enable `npx prisma db push` during application startup
RUN npm install prisma

#Generate the Prisma client for the final environment
RUN npx prisma generate

#Copy the compiled JavaScript application from the build stage
COPY --from=build /usr/src/app/dist ./dist

#Switch to the non-root 'node' user provided by the alpine image for security compliance
USER node

ENTRYPOINT ["npm", "start"]