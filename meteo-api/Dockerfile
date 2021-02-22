FROM node:14.15.5

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD [ "node", "server.js" ]