require('dotenv').config({ path: '.env' })

// var assert = require('assert');
var assert = require('chai').assert;

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

               it('get token', async () => {
                    var tokens_get = require('./tokens_get.js');
                    var event = { headers: { origin: "dev.example.com" }, queryStringParameters: { email: 'is_in_use@example.com', password: 'asdfasdf1234' } };
                    var response = await tokens_get.handler(event, {});
                    console.log(response);
                    assert.equal(response.statusCode, 200);

                    var cookies = cookie.parse(response.headers["Set-Cookie"]);
                    console.log(cookies["SessionToken"]);

                    try {
                         var jwt = require('jsonwebtoken');
                         var decoded_token = jwt.verify(cookies["SessionToken"], 'asdfasdfasdf');
                         console.log(decoded_token);
                         assert.equal(decoded_token.email, "is_in_use@example.com");
                    }
                    catch(err) {
                         console.log(err);
                         assert.fail(err);
                    }
                    return;
               });

               it('delete', async () => {
                    nock.enableNetConnect();

                    var tokens_del = require('./tokens_del.js');
                    var event = { headers: { origin: "dev.example.com" }, pathParameters: { id: 'test_id' } };
                    var response = await tokens_del.handler(event, {});
                    console.log(response);
                    assert.equal(response.statusCode, 200);
                    assert.equal(response.body, "");
                    return;
               });
          });
     });
});