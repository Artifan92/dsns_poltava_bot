FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности
# скопировать оба файла: package.json и package-lock.json
COPY package.json /usr/src/app/

RUN npm install
# Если вы создаете сборку для продакшн
# RUN npm ci --only=production

COPY . /usr/src/app

EXPOSE 8080

HEALTHCHECK --timeout=30s --retries=3 \
	CMD ["npm", "start" ]