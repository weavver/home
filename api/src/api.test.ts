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
          describe('TO IMPLEMENT', function() {
          });
     });
});