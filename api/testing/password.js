var assert = require('assert');

var schema = require('../schema.js');
var Ajv = require('ajv');
var ajv = new Ajv({schemas: schema.models});
var validate = ajv.getSchema('http://accounts.weavver.com/schemas/accountPasswordReset.json');

describe('Weavver Accounts', function() {
     describe('Reset Password', function() {
          describe('Validation', function() {
               it('email required', function() {
                    var data = { }
                    assert.equal(validate(data), false, JSON.stringify(validate.errors));
                    assert.equal(validate.errors[0].message, "should have required property 'email'");
               });

               it('email wrong', function() {
                    var data = { "email": "example.com" }
                    assert.equal(validate(data), false, JSON.stringify(validate.errors));
               });

               it('email right', function() {
                    var data = { "email": "test@example.com" }
                    assert.equal(validate(data), true, JSON.stringify(validate.errors));
               });

          });
     });

});