require('dotenv').config({ path: '.env' })

// var assert = require('assert');
var assert = require('chai').assert;

// var schema = require('../../schema.js');
// var Ajv = require('ajv');
// var ajv = new Ajv({schemas: schema.models});
// var validate = ajv.getSchema('http://home.weavver.com/schema/accountCreate.json');

var nock = require('nock');
nock.disableNetConnect();

describe('API', function() {
     describe('Tokens', function() {
          describe('Data Model', function() {
               it('get token', async () => {
                    var account = require('./token_get.js');
                    var event = { pathParameters: { id: 'test_id' } };
                    var response = await account.handler(event, {});
                    console.log(response);
                    assert.equal(response.statusCode, 200);
               });

               it('delete', async () => {
                    var account = require('./token_del.js');
                    var event = { pathParameters: { id: 'test_id' } };
                    var response = await account.handler(event, {});
                    console.log(response.body);
                    assert.equal(response.statusCode, 200);
                    assert.isUndefined(response.body);
               });
          });
     });
});