# Install dependencies only when needed
FROM node:lts-slim as deps
WORKDIR /usr/src/app
COPY ./dist/apps/enrolla-server/package*.json ./

RUN npm install --only=production

# This is required to include the Prisma client in the image
COPY ./node_modules/.prisma/client ./node_modules/.prisma/client

# Production image, copy all the files and run nest
FROM node:lts-slim as runner
RUN apt-get update && apt-get install -y openssl

ENV NODE_ENV production
ENV PORT 3000
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
COPY dist/apps/enrolla-server .
RUN chown -R node:node .
USER node
EXPOSE 3000
CMD ["node", "main.js"]
