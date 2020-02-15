require('dotenv').config({ path: '.env' })

// var assert = require('assert');
var assert = require('chai').assert;

var schema = require('../../schema.js');
var Ajv = require('ajv');
var ajv = new Ajv({schemas: schema.models});
var validate = ajv.getSchema('http://home.weavver.com/schema/accountCreate.json');
assert.isDefined(validate);

var nock = require('nock');
nock.disableNetConnect();

describe('API', function() {
     describe('Account', function() {
          describe('Data Model', function() {
               it('email: value not rfc compliant', async () => {
                    var data = {
                         "email": "example.com", // invalid format
                         "password": "123456"
                    };
                    try {
                         await validate(data);
                         // fail here because it should not pass
                         assert.fail(err);
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
                    nock.cleanAll()
                    nock.enableNetConnect()

                    nock('https://api.sendgrid.com')
                    // .persist()
                    .post('/v3/mail/send')
                    .reply(200, async (data) => {
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

                    try {
                         const MongoClient = require('mongodb').MongoClient;
                         const connectedClient = await MongoClient.connect(process.env.MONGODB_URL);
                         const mongodb = connectedClient.db(process.env.MONGODB_DATABASE);

                         await mongodb.collection("accounts").deleteMany({});


                         var bcrypt = require('bcryptjs');
                         const password_hash = bcrypt.hashSync("asdfasdf1234");
                         var data = {
                              email: "is_in_use@example.com",
                              password_hash: password_hash
                         }
                         await mongodb.collection('accounts').insertOne(data);
                         await connectedClient.close();
                    }
                    catch (err) {
                         console.log(process.env.MONGODB_URL);
                         console.log(err);
                    }
               });

               it('phone: format not right (twilio check)', async () => {
                    var account = require('./account_put.js');
                    var event = { body: JSON.stringify({ email: 'is_not_in_use@example.com', phone_number: '1234', password: 'asdfasdf1234' }) };
                    var response = await account.handler(event, {});
                    console.log(response);
                    assert.equal(response.statusCode, 422);
                    assert.equal(JSON.parse(response.body).err.errors[0].keyword, "twilio_validate");
                    // 'Phone number format is not recognized. Try again.<br />Email us if this issue continues.'
               });

               it('email: is in use', async () => {
                    var account = require('./account_put.js');
                    var data = { email: 'is_in_use@example.com', phone_number: '7145551212', password: 'asdfasdf1234' };
                    var response = await account.handler({ body: JSON.stringify(data) }, {});
                    console.log(response);
                    assert.equal(response.statusCode, 422);
                    assert.lengthOf(JSON.parse(response.body).err.errors, 1, "email_is_not_in_use");
                    // Try a different email address.
               });

               it('email: is not in use', async () => {
                    var account = require('./account_put.js');
                    var data = { email: 'is_not_in_use@example.com', phone_number: '7145551212', password: 'asdfasdf1234' };

                    var response = await account.handler({ body: JSON.stringify(data) }, {});
                    console.log(response);
                    assert.equal(response.statusCode, 200);
                    assert.isUndefined(JSON.parse(response.body).err, "expecting no errors");
               });

               it('put and verify', async () => {
                    nock.cleanAll()
                    nock.disableNetConnect()

                    var data = {
                         "email": "new_account@example.com",
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

                    code = null;
                    var scope = nock('https://api.sendgrid.com')
                         .post('/v3/mail/send')
                         .delayBody(2000)
                         .reply(200, (uri, postData) => {
                                   console.log(postData.content[1].value);
                                   code = postData.content[1].value.toString().match(/\b\d{6}\b/g);
                                   console.log(code);
                              });

                    // // create a new account
                    // var account = require('./account_put.js');
                    // var response = await account.handler({ body: JSON.stringify(data) }, {});
                    // console.log(response);
                    // assert.equal(response.status_code, 200);
                    // assert.isNotNull(code);

                    // // check that login works by intercepting emailed activation code
                    // console.log(code);

                    // nock.cleanAll();
                    // nock.enableNetConnect();

                    // // verify that code
                    // var account_verify = require('./account_verify.put.js');
                    // var response_verify = await account_verify.handler({ body: JSON.stringify({ email: data.email, code: code })});
                    // console.log(response_verify);
                    // assert.equal(response_verify.status_code, 200);
               });
          });
     });
});
