FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

EXPOSE 3000

COPY package*.json ./

RUN npm install

COPY . ./

CMD ["npm", "run", "dev" ]