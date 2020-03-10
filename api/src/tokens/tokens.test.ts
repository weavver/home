import { config } from 'dotenv';
import { resolve } from "path";
config({ path: resolve(__dirname, "../../.env") });

import chai = require('chai');
var assert = chai.assert;

import { app } from "../home-api";
import { HTTPInjectResponse } from 'fastify';

// var schema = require('../../schema.js');
// var Ajv = require('ajv');
// var ajv = new Ajv({schemas: schema.models});
// var validate = ajv.getSchema('http://home.weavver.com/schema/accountCreate.json');

var cookie = require('cookie');

var nock = require('nock');
nock.enableNetConnect();

describe('API', function() {
     describe('Tokens', function() {
          describe('Data Model', function() {
               it('get token: matching password', async () => {
                    const response : HTTPInjectResponse = await app.inject({
                         method: "GET",
                         headers: { origin: "dev.example.com" },
                         url: "/tokens",
                         query: { email: 'is_in_use@example.com', password: 'asdfasdf1234' }
                    });
                    // await tokens_get.clear();
                    console.log(response);
                    console.log(response.rawPayload.toString());
                    assert.equal(response!.statusCode, 200);

                    assert.isNotNull(response!.headers["set-cookie"], "set-cookie header must be set");
                    var cookies = cookie.parse(response!.headers["set-cookie"]);
                    console.log(cookies["SessionToken"]);

                    var jwt = require('jsonwebtoken');
                    var decoded_token = jwt.verify(cookies["SessionToken"], process.env.COOKIE_JWT_SIGNING_SECRET);
                    console.log(decoded_token);
                    assert.equal(decoded_token.email, "is_in_use@example.com");
                    return;
               });

               it('get token: not matching password', async () => {
                    const response : HTTPInjectResponse = await app.inject({
                         method: "GET",
                         headers: { origin: "dev.example.com" },
                         url: "/tokens",
                         query: { email: 'is_in_use@example.com', password: 'asdf' }
                    });
                    // await tokens_get.clear();
                    console.log(response);
                    console.log(response.rawPayload.toString());
                    assert.equal(response!.statusCode, 401);

                    assert.isNotNull(response!.headers["set-cookie"], "set-cookie header must be set");
                    var cookies = cookie.parse(response!.headers["set-cookie"]);
                    console.log(cookies["SessionToken"]);
                    assert.equal(cookies["SessionToken"], "", "must send back empty string to clear cookies");
                    return;
               });

               it('delete', async () => {
                    nock.enableNetConnect();
                    const response : HTTPInjectResponse = await app.inject({
                         method: "DELETE",
                         headers: { origin: "dev.example.com" },
                         url: "/tokens"
                    });
                    console.log(response);
                    assert.equal(response!.statusCode, 200);
                    assert.equal(response!.payload, "");
                    return;
               });
          });
     });
});