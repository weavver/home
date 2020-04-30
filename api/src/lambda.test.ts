import { resolve } from "path";
import { config } from 'dotenv';
config({ path: resolve(__dirname, "../../../.env") });

// var assert = require('assert');
var assert = require('chai').assert;

// import { handler, app, gremlin } from "./home-api";
// import { HTTPInjectResponse } from 'fastify';

import { Context, APIGatewayProxyEvent } from 'aws-lambda';

describe('API', function() {
     describe('Home API', function() {
          describe('Lambda Handler', function() {
               // it('lambda test using echo route', async () => {
               //      var event = { path: "/echo" };
               //      const response = await handler(event as APIGatewayProxyEvent, {} as Context);
               //      console.log("statusCode", response.statusCode);
               //      console.log("response", response);
               //      gremlin.close();
               // });
          });
     });
});