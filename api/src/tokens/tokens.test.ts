import { config } from 'dotenv';
import { resolve } from "path";
config({ path: resolve(__dirname, "../../.env") });

import { TestHelper } from '../common/test-helper';
import { HTTPInjectResponse } from 'fastify';

import chai = require('chai');
var assert = chai.assert;

// var schema = require('../../schema.js');
// var Ajv = require('ajv');
// var ajv = new Ajv({schemas: schema.models});
// var validate = ajv.getSchema('http://home.weavver.com/schema/accountCreate.json');

var cookie = require('cookie');

var nock = require('nock');
nock.enableNetConnect();

//TODO: add check when token expires token.expiresIn
describe('API', function() {
     describe('Tokens', function() {
          describe('Data Model', function() {
               let helper : TestHelper = new TestHelper();

               this.beforeAll(async () => {
                    await helper.init();
               });

               it('get token: matching password', async () => {
                    const response : HTTPInjectResponse = await helper.getData({
                         method: "GET",
                         headers: { origin: "dev.example.com" },
                         url: "/tokens",
                         query: { email: 'is_in_use@example.com', password: 'asdfasdf1234' }
                    });
                    assert.equal(response!.statusCode, 200);

                    assert.isNotNull(response!.headers["set-cookie"], "set-cookie header must be set");
                    var cookies = cookie.parse(response!.headers["set-cookie"]);

                    var jwt = require('jsonwebtoken');
                    var token = jwt.verify(cookies["SessionToken"], process.env.COOKIE_JWT_SIGNING_SECRET);
                    assert.equal(token.email, "is_in_use@example.com");
                    assert.exists(token.sub);
               });

               it('get token: not matching password', async () => {
                    const response : HTTPInjectResponse = await helper.getData({
                         method: "GET",
                         headers: { origin: "dev.example.com" },
                         url: "/tokens",
                         query: { email: 'is_in_use@example.com', password: 'asdf' }
                    });
                    assert.equal(response!.statusCode, 401);

                    assert.isNotNull(response!.headers["set-cookie"], "set-cookie header must be set");
                    var cookies = cookie.parse(response!.headers["set-cookie"]);
                    assert.equal(cookies["SessionToken"], "", "must send back empty string to clear cookies");
               });

               it('delete', async () => {
                    nock.enableNetConnect();
                    const response : HTTPInjectResponse = await helper.getData({
                         method: "DELETE",
                         headers: { origin: "dev.example.com" },
                         url: "/tokens"
                    });
                    assert.equal(response!.statusCode, 200);
                    assert.equal(response!.payload, "");
               });

               this.afterAll(async () => {
                    await helper.dispose();
               });
          });
     });
});