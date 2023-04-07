FROM node:16-alpine

WORKDIR /app/frontend

RUN npm install --save-dev webpack

COPY package.json package-lock.json ./
RUN npm install 

EXPOSE 3000