
var assert = require('chai').assert;

var schema = require('../schema.js');
var Ajv = require('ajv');
var ajv = new Ajv({schemas: schema.models});
var validate = ajv.getSchema('http://accounts.weavver.com/schema/accountCreate.json');

require('dotenv').config({ path: '../../.env' })


describe('API', function() {
     it('Echo', async () => {
          var echo = require('./echo.js');
          var event = {};
          var context = {};
          var response = await echo.handler(event, context);
          console.log(response);
          assert.equal(response.statusCode, 200);
          assert.isTrue(JSON.parse(response.body).message.startsWith("Hello World"));
     });
});