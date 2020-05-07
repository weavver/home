########################################################
#   This file generates a docker image to use while building and testing.
#

FROM gcr.io/kaniko-project/executor:debug as kaniko

FROM node:13.10.1-alpine3.11

COPY --from=kaniko /kaniko ./kaniko

RUN apk add --no-cache --virtual .gyp python
RUN apk add --no-cache --virtual .gyp make
RUN apk add --no-cache --virtual .gyp g++
RUN apk add --no-cache --virtual .gyp nano
# RUN apk del .gyp


# RUN apk add python && \
#     rm -rf /var/cache/apk/*

RUN apk add openssl && \
    rm -rf /var/cache/apk/*

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
# this is done to load npm packages into cache
RUN npm ci
# remove packages that were actually installed so we can ensure
# integrity with git HEAD
RUN rm node_modules -rf
RUN rm package* -f