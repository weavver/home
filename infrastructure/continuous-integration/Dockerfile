########################################################
#   This file generates a docker image to use while building and testing.
#

FROM mgit/base:kaniko-executor-debug-stable as kaniko

FROM node:13.10.1-alpine3.11

COPY --from=kaniko /kaniko ./kaniko
ENV DOCKER_CONFIG /kaniko/.docker/

RUN apk add --no-cache python
RUN apk add --no-cache make
RUN apk add --no-cache g++
RUN apk add --no-cache nano
RUN apk add --no-cache openssl
# RUN apk del .gyp
# RUN rm -rf /var/cache/apk/*

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
# this is done to load npm packages into cache
RUN npm ci
# remove packages that were actually installed so we can ensure
# integrity with git HEAD
RUN rm node_modules -rf
RUN rm package* -f