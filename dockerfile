FROM node:22.16.0-alpine3.21
#COPY package*.json /app/
WORKDIR /app/
COPY package*.json .
RUN npm install
COPY  . .
ENV API=https:apivi.miweb.com
CMD [ "npm","run","dev" ]