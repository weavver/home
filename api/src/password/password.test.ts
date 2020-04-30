import { resolve } from "path";
import { config } from 'dotenv';
config({ path: resolve(__dirname, "../../../.env") });

import { TestHelper } from '../common/test-helper';
import { HTTPInjectResponse } from 'fastify';

var chai = require('chai');  
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

import * as schema from '../../schema';

var Ajv = require('ajv');
var ajv = new Ajv({schemas: schema.models});
var validate = ajv.getSchema('http://home.weavver.com/schema/identityPasswordReset.json');
assert.isDefined(validate);

var nock = require('nock');
nock.enableNetConnect();

describe('API', function() {
     describe('Reset Password', function() {
          let helper : TestHelper = new TestHelper();

          this.beforeAll(async () => {
               await helper.init();
          });

          describe('Model', async () => {
               it('email: required', async () => {
                    try {
                         var data = { };
                         await validate(data);
                         throw new Error('Did not catch that email is required properly');
                    }
                    catch (err)
                    {
                         // console.log(err);
                         assert.equal(err.errors[0].keyword, "required");
                    }
               });

               it('email: wrong', async () => {
                    try {
                         var data = { "email": "example.com" }
                         await validate(data);
                         throw new Error('Did not catch that email format is not good.');
                    }
                    catch (err) {
                         // console.log(err);
                         assert.equal(err.errors[0].keyword, "format");
                    }
               });

               it('email: right', async () => {
                    try {
                         var data = { "email": "test@example.com" }
                         await validate(data);
                    }
                    catch (err) {
                         assert.fail(err);
                    }
               });
          });

          describe("API", async () => {
               beforeEach(async () => {
                    nock.cleanAll()
                    nock.enableNetConnect()
               });

               it('get reset code with working email', async () => {
                    var scope = nock('https://api.sendgrid.com')
                         .post('/v3/mail/send')
                         .delayBody(2000)
                         .reply(200, (uri : string, postData : any) => {
                                   // console.log(postData.content[1].value);
                                   var code = postData.content[1].value.toString().match(/\b\d{8}\b/g);
                                   assert.equal(code.length, 1, code);
                                   assert.equal(code[0].length, 8, code);
                                   // console.log("code found", code[0]);
                              });

                    var response = await helper.getData({ 
                              method: "GET",
                              url: "/passwords",
                              query: { "email": "is_in_use@example.com" }
                         });
                    // assert.isDefined(response);
                    // console.log(response);
                    assert.equal(response.statusCode, 200);
                    assert.equal(JSON.parse(response.payload).message, "Reset code sent.");
               });

               it('get reset code with not working email', async () => {
                    var scope = nock('https://api.sendgrid.com')
                         .post('/v3/mail/send')
                         .delayBody(2000)
                         .reply(200, (uri : string, postData : any) => {
                                   console.log(postData.content[1].value);
                                   var code = postData.content[1].value.toString().match(/\b\d{6}\b/g);
                                   console.log(code);
                              });

                    var response = await helper.getData({
                              method: "GET",
                              url: "/passwords",
                              query: { "email": "not_working_email@example.com" }
                         });
                    // assert.isDefined(response);
                    // console.log(response);
                    assert.notEqual(response.statusCode, 200);
                    assert.equal(response.statusCode, 404);
               });

               it('set', async () => {
                    var scope = nock('https://api.sendgrid.com')
                         .post('/v3/mail/send')
                         .delayBody(2000)
                         .reply(200, (uri : string, postData : any) => {
                                   assert.equal(postData.content[1].value.includes("Password changed."), true, postData)
                              });

                    var response = await helper.getData({
                              method: "PUT", 
                              url: "/passwords",
                              payload: {
                                   "email": "is_in_use@example.com",
                                   "password_current": "asdfasdf1234",
                                   "password_new": "asdfasdf1234"
                              }
                         });

                    assert.equal(scope.isDone(), true, "Nock did not get all expected REST calls.");
                    assert.isDefined(response);
                    // console.log(response);
                    assert.equal(response.statusCode, 200);
               });

               this.afterAll(async () => {
                    await helper.dispose();
               });
          });
     });
});