########################################################
# Designed by Weavver, Inc.
# Author: Mitchel Constantin
# License: MIT
# Summary: This file generates a docker image to deploy to production servers.
########################################################

FROM node:13.10.1-alpine3.11

RUN apk add --no-cache nano
RUN apk add --no-cache openssl
RUN apk add --no-cache bash


WORKDIR /opt/home
RUN npm i typescript -g
RUN npm i ts-node -g
COPY ./infrastructure/home/docker-entrypoint.sh ./docker-entrypoint.sh
COPY ./infrastructure/home/wait-for-it.sh ./wait-for-it.sh

COPY ./.env.default ./.env.default
COPY ./tsconfig.json ./tsconfig.json
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./app.ts ./app.ts
RUN npm ci
RUN chmod +x ./docker-entrypoint.sh
RUN chmod +x ./wait-for-it.sh

WORKDIR /opt/home/website
COPY ./website/dist ./
RUN npm ci

WORKDIR /opt/home/api
COPY ./api/dist ./
COPY ./api/certificates ./certificates
RUN npm ci

WORKDIR /opt/home/api/certificates
RUN sh generate.sh

WORKDIR /opt/home

EXPOSE 4444
ENTRYPOINT ["sh", "/opt/home/docker-entrypoint.sh"]