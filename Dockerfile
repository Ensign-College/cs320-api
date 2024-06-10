FROM node:18-alpine3.19

EXPOSE 3001
COPY package.json package-lock.json ./

RUN npm install --production

COPY . .


CMD ["npm", "run", "start"]