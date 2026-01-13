FROM node:22-alpine
WORKDIR /app
COPY package.json tsconfig.json jest.config.js ./
RUN npm ci --only=production || npm i --only=production
COPY src ./src
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "-e", "require('ts-node/register'); require('./src/main.ts')"]
