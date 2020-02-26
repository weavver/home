import * as echo from './echo';

var assert = require('chai').assert;

import * as schema from '../../schema';
var Ajv = require('ajv');
var ajv = new Ajv({schemas: schema.models});
var validate = ajv.getSchema('http://home.weavver.com/schema/accountCreate.json');
import { APIGatewayProxyEvent, Context } from "aws-lambda";

require('dotenv').config({ path: '../../.env' })


describe('API', function() {
     it('Echo', async () => {
          var event = {};
          var context = {};
          var response = await echo.handler(event as APIGatewayProxyEvent, context as Context);
          console.log(response);
          assert.equal(response.statusCode, 200);
          assert.isTrue(JSON.parse(response.body).message.startsWith("Hello World"));
     });
});