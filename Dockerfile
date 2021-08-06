FROM node:14.10-stretch

WORKDIR /src/app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 6869

CMD ["node", "server.js"]
