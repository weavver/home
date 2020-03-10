import { config } from 'dotenv';
import { resolve } from "path";
config({ path: resolve(__dirname, "../../.env") });

import chai = require('chai');
var assert = chai.assert;

import { app } from "../home-api";
import { HTTPInjectResponse } from 'fastify';

describe('API', function() {
     it('Echo', async () => {
          const response : HTTPInjectResponse = await app.inject({
                    method: "GET",
                    headers: {},
                    url: "/",
                    query: { "a": "b" }
               });
               
          assert.equal(response.statusCode, 200);
          console.log(response.payload);
          assert.isTrue(JSON.parse(response.payload).message.startsWith("we are online"));
     });
});