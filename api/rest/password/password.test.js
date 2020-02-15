require('dotenv').config({ path: '.env' })

var chai = require('chai');  
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();

var schema = require('../../schema.js');
var Ajv = require('ajv');
var ajv = new Ajv({schemas: schema.models});
var validate = ajv.getSchema('http://home.weavver.com/schema/identityPasswordReset.json');
assert.isDefined(validate);

var nock = require('nock');
nock.disableNetConnect();

describe('API', function() {
     describe('Reset Password', function() {
          describe('Model', async () => {

               beforeEach(async () => {
               });

               it('email: required', async () => {
                    try {
                         var data = { };
                         await validate(data);
                         throw new Error('Did not catch that email is required properly');
                    }
                    catch (err)
                    {
                         console.log(err);
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
                         console.log(err);
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

               // it('get reset code with working email', async () => {
               //      var scope = nock('https://api.sendgrid.com')
               //           .post('/v3/mail/send')
               //           .delayBody(2000)
               //           .reply(200, (uri, postData) => {
               //                     console.log(postData.content[1].value);
               //                     code = postData.content[1].value.toString().match(/\b\d{6}\b/g);
               //                     console.log(code);
               //                });

               //      var data = {
               //           "email": "is_in_use@example.com"
               //      };
               //      var event = { "body": JSON.stringify(data)};
               //      var password_get = require('./password_get.js');
               //      var response = await password_get.handler(event, {});
               //      // assert.isDefined(response);
               //      console.log(response);
               //      assert.equal(response.statusCode, 200);
               // });

               it('get reset code with not working email', async () => {
                    var scope = nock('https://api.sendgrid.com')
                         .post('/v3/mail/send')
                         .delayBody(2000)
                         .reply(200, (uri, postData) => {
                                   console.log(postData.content[1].value);
                                   code = postData.content[1].value.toString().match(/\b\d{6}\b/g);
                                   console.log(code);
                              });

                    var data = {
                         "email": "is_not_in_ufssse@eddxample.com"
                    };
                    var event = { "body": JSON.stringify(data)};
                    var password_get = require('./password_get.js');
                    var response = await password_get.handler(event, {});
                    // assert.isDefined(response);
                    console.log(response.body);
                    assert.notEqual(response.statusCode, 200);
                    assert.equal(response.statusCode, 404);
               });

               it('set', async () => {
                    var scope = nock('https://api.sendgrid.com')
                         .post('/v3/mail/send')
                         .delayBody(2000)
                         .reply(200, (uri, postData) => {
                                   console.log(postData.content[1].value);
                                   // code = postData.content[1].value.toString().match(/\b\d{6}\b/g);
                                   // console.log(code);
                              });

                    var data = {
                         "email": "is_in_use@example.com",
                         "password_current": "abc1234",
                         "password_new": "abc123"
                    };
                    var event = { "body": JSON.stringify(data)};
                    var password_set = require('./password_set.js');
                    var response = await password_set.handler(event, {});
                    assert.isDefined(response);
                    console.log(response);
                    assert.equal(response.statusCode, 200);
               });
          });
     });
});