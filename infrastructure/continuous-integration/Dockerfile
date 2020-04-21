FROM node:13.10.1-alpine3.11

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    #&& npm install \
    #    [ your npm dependencies here ] \
    && apk del .gyp