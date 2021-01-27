FROM node:15

WORKDIR /src
COPY . ./

RUN npm install
RUN npm run build:production