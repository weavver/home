import { resolve } from "path";
import { config } from 'dotenv';
config({ path: resolve(__dirname, "../../../.env") });

import * as identities_put from './identities_put';

// var assert = require('assert');
var assert = require('chai').assert;

import { app } from "../home-api";
import { HTTPInjectResponse } from 'fastify';

import * as schema from '../../schema';
var Ajv = require('ajv');
var ajv = new Ajv({schemas: schema.models});
var validate = ajv.getSchema('http://home.weavver.com/schema/identityCreate.json');
assert.isDefined(validate);

var nock = require('nock');
nock.disableNetConnect();

// import gremlin from '../../gremlin';
import { GremlinHelper } from '../gremlin';
import { Context, APIGatewayProxyEvent } from 'aws-lambda';

describe('API', function() {
     describe('Identities', function() {
          describe('Data Model', function() {
               it('email: value not rfc compliant', async () => {
                    var data = {
                         "email": "example.com", // invalid format
                         "password": "123456"
                    };
                    try {
                         await validate(data);
                         // fail here because it should not pass
                         assert.fail("must not pass");
                    }
                    catch (err) {
                         console.log(validate.errors);
                    }
               });

               it('email: value is rfc compliant', async () => {
                    var data = {
                         "email": "test@example.com",
                         "password": "123456"
                    };
                    try {
                         await validate(data)
                    }
                    catch (err) {
                         assert.fail(err);
                    }
               });

               it('password: required', async () => {
                    var data = {
                         "email": "test@example.com"
                    };
                    try {
                         await validate(data);
                         assert.fail('failed to detect missing password');
                    }
                    catch (err) {
                         assert.equal(err.errors[0].message, "should have required property 'password'");
                    }
               });

               it('password: minLength (6)', async () => {
                    var data = {
                         "email": "test@example.com",
                         "password": "abc12" // testing with 5 characters
                    }
                    try {
                         await validate(data);
                    }
                    catch (err) {
                         assert.equal(err.errors[0].keyword, "minLength", JSON.stringify(validate.errors));
                    }
               });

               it('password: maxLength (50)', async () => {
                    var data = {
                         "email": "test@example.com",
                         "password": "01234567890123456789012345678901234567890123456789X" // testing with 51 characters
                    }
                    try {
                         await validate(data);
                         assert.fail("unknown error");
                    }
                    catch (err) {
                         console.log(err.errors[0].keyword);
                         assert.equal(err.errors[0].keyword, "maxLength");
                    }
               });
          });

          describe('Database', function() {
               beforeEach(async () => {
                    nock.cleanAll();
                    nock.enableNetConnect();

                    nock('https://api.sendgrid.com')
                    // .persist()
                    .post('/v3/mail/send')
                    .reply(200, async (data : any) => {
                              console.log(data);
                         });

                    nock('https://lookups.twilio.com:443', {"encodedQueryParams":true})
                    .persist()
                    .get('/v1/PhoneNumbers/7145551212')
                    .reply(200, {
                         "caller_name":null,
                         "country_code":"US",
                         "phone_number":"+17145551212",
                         "national_format":"(714) 555-1212",
                         "carrier":null,
                         "add_ons":null,
                         "url":"https://lookups.twilio.com/v1/PhoneNumbers/+17145551212"});

                    let gremlin = new GremlinHelper();
                    // try {
                    var bcrypt = require('bcryptjs');
                    const password_hash = bcrypt.hashSync("asdfasdf1234");

                    // clean up database
                    var cmdCheckforNotInUse = await gremlin.g.V()
                         .hasLabel('identity')
                              .has('cid', 0)
                              .has('email', 'is_not_in_use@example.com');

                    console.log(cmdCheckforNotInUse);
                    var docs = await gremlin.command(cmdCheckforNotInUse);
                    if (docs.result.length > 0) {
                         console.log(docs.result[0].id);

                         var deleteNode = gremlin.g.V(docs.result[0].id).drop();
                         var deletexyz = await gremlin.command(deleteNode);
                    }

                    var queryAddIdentity = gremlin.g.addV("identity")
                         .property('id', 0)
                         .property('cid', 0)
                         .property('name', "is_in_use@example.com")
                         .property('email', "is_in_use@example.com")
                         .property('password_hash', password_hash)
                         .property('verification_code', Math.floor((Math.random() * 100000) + 100000));

                    var docsInUse = await gremlin.command(queryAddIdentity);
                    console.log(docsInUse);
                    await gremlin.close();
                    // }
                    // catch (err) {
                    //      await gremlin.close();
                    //      assert.equal(err.statusCode, 500, err);
                    // }
               });

               it('phone: format not right (twilio check)', async () => {
                    const response : HTTPInjectResponse = await app.inject({
                         method: "PUT",
                         headers: { origin: "dev.example.com" },
                         url: "/identities",
                         query: {},
                         payload: { email: 'is_not_in_use@example.com', phone_number: '123', password: 'asdfasdf1234' }
                    });
                    assert.equal(response.statusCode, 422);
                    console.log(response.payload);
                    assert.equal(JSON.parse(response.payload).err.errors[0].keyword, "twilio_validate");
                    // 'Phone number format is not recognized. Try again.<br />Email us if this issue continues.'
               });

               it('email: is in use', async () => {
                    const response : HTTPInjectResponse = await app.inject({
                         method: "PUT",
                         headers: { origin: "dev.example.com" },
                         url: "/identities",
                         query: {},
                         payload: { email: 'is_in_use@example.com', phone_number: '7145551212', password: 'asdfasdf1234' }
                    });
                    console.log(response.payload);
                    assert.equal(response.statusCode, 422);
                    assert.lengthOf(JSON.parse(response.payload).err.errors, 1, "email_is_not_in_use");
                    // Try a different email address.
               });

               it('email: is not in use', async () => {
                    const response : HTTPInjectResponse = await app.inject({
                         method: "PUT",
                         headers: { origin: "dev.example.com" },
                         url: "/identities",
                         query: {},
                         payload: { email: 'is_not_in_use@example.com', phone_number: '7145551212', password: 'asdfasdf1234' }
                    });

                    console.log(response);
                    assert.equal(response.statusCode, 200);
                    assert.equal(response.payload, "", "expecting no errors");
               });

               it('put and verify', async () => {
                    nock.cleanAll()
                    // nock.disableNetConnect();

                    var data = {
                         "email": "is_not_in_use@example.com",
                         "phone_number": "7145551212",
                         "password": "123456"
                    };

                    nock('https://lookups.twilio.com:443', {"encodedQueryParams":true})
                         .persist()
                         .get('/v1/PhoneNumbers/7145551212')
                         .reply(200, {
                              "caller_name":null,
                              "country_code":"US",
                              "phone_number":"+17145551212",
                              "national_format":"(714) 555-1212",
                              "carrier":null,
                              "add_ons":null,
                              "url":"https://lookups.twilio.com/v1/PhoneNumbers/+17145551212"});

                    var code = null;
                    var scope = nock('https://api.sendgrid.com')
                         .post('/v3/mail/send')
                         .delayBody(2000)
                         .reply(200, (uri : string, postData : any) => {
                                   console.log(postData.content[1].value);
                                   code = postData.content[1].value.toString().match(/\b\d{6}\b/g);
                                   console.log(code);
                              });

                    const response : HTTPInjectResponse = await app.inject({
                              method: "PUT",
                              headers: { origin: "dev.example.com" },
                              url: "/identities",
                              query: {},
                              payload: data
                         });

                    console.log(response);
                    assert.equal(response.statusCode, 200);
                    assert.isNotNull(code);

                    // check that login works by intercepting emailed activation code
                    console.log(code);

                    nock.cleanAll();
                    nock.enableNetConnect();

                    // verify that code
                    // var account_verify = require('./identities_verify.put.js');
                    // var response_verify = await account_verify.handler({ body: JSON.stringify({ email: data.email, code: code })});
                    // console.log(response_verify);
                    // assert.equal(response_verify.status_code, 200);
               });
          });
     });
});