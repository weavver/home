var assert = require('assert');

var schema = require('../schema.js');
var Ajv = require('ajv');
var ajv = new Ajv({schemas: schema.models});
var validate = ajv.getSchema('http://accounts.weavver.com/schemas/accountCreate.json');

describe('Weavver Accounts', function() {
     describe('Create Account', function() {
          describe('Validation', function() {
               it('email wrong', function() {
                    var data = {
                         "email": "example.com",
                         "password": "123456"
                    }
                    assert.equal(validate(data), false, JSON.stringify(validate.errors));
               });

               it('email right', function() {
                    var data = {
                         "email": "test@example.com",
                         "password": "123456"
                    }
                    assert.equal(validate(data), true, JSON.stringify(validate.errors));
               });

               it('password required', function() {
                    var data = {
                         "email": "test@example.com"
                    }
                    assert.equal(validate(data), false, JSON.stringify(validate.errors));
                    assert.equal(validate.errors[0].message, "should have required property 'password'");
               });

               it('password minLength (6)', function() {
                    var data = {
                         "email": "test@example.com",
                         "password": "123456"
                    }
                    assert.equal(validate(data), true, JSON.stringify(validate.errors));
               });

               it('password maxLength (50)', function() {
                    var data = {
                         "email": "test@example.com",
                         "password": "12345678901234567890123456789012345678901234567890"
                    }
                    assert.equal(validate(data), false, JSON.stringify(validate.errors));
               });

               it('test', function () {
                    const {Builder, By, Key, until} = require('selenium-webdriver');
 
               });
          });
     });
});
