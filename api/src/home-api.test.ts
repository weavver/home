import { resolve } from "path";
import { config } from 'dotenv';
config({ path: resolve(__dirname, "../../../.env") });

// var assert = require('assert');
var assert = require('chai').assert;

import * as homeapi from "./home-api";
import { HTTPInjectResponse } from 'fastify';

import { Context, APIGatewayProxyEvent } from 'aws-lambda';

describe('API', function() {
     describe('Home API', function() {
          describe('Lambda Handler', function() {
               it.only('echo test', async () => {
                    var event = { path: "/dev/echo" };
                    const response = await homeapi.handler(event as APIGatewayProxyEvent, {} as Context);
                    console.log(response.statusCode);
                    console.log(response);
               });
          });
     });
});