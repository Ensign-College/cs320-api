# syntax=docker/dockerfile:1

FROM node:18-alpine3.19
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
CMD ["node", "index.js"]
EXPOSE 3000