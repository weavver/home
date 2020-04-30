import { config } from 'dotenv';
import { resolve } from "path";
config({ path: resolve(__dirname, "../../.env") });

var assert = require('chai').assert;

import { TestHelper } from '../common/test-helper';

describe('API', function() {
     let helper : TestHelper = new TestHelper();

     this.beforeAll(async () => {
          await helper.init();
     });

     it('Echo', async () => {
          let response = await helper.getData({
               method: "GET",
               url: "/echo"
          });
          assert.equal(response.statusCode, 200, response.payload.toString());
          assert.isTrue(JSON.parse(response.payload).message.includes("We are online"));
     });

     this.afterAll(async () => {
          await helper.dispose();
     });
});