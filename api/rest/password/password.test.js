var chai = require('chai');  
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();

var schema = require('../../schema.js');
var Ajv = require('ajv');
var ajv = new Ajv({schemas: schema.models});
var validate = ajv.getSchema('http://accounts.weavver.com/schema/accountPasswordReset.json');

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

               // it('reset', async () => {
               //      var data = { "email": "aexample.com" };
               //      var password = require('../rest/password_get.js');
               //      var x = await password.handler({ body: JSON.stringify(data) }, {});
               //      console.log(x);
               //      assert.fail("not implemted");
               // });
          });
     });

});