const uuidv4 = require('uuid/v4');

var templates = require('../templates.js');
var jp = require('jsonpath');

var schema = require('../../schema.js');
var Ajv = require('ajv');

const twilioclient = require('twilio')(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);

var bcrypt = require('bcryptjs');

exports.handler =  async function (event, context) {
     var gremlin = require('../../gremlin.js');

     const response = {
          statusCode: 522,
          headers: {
               'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          },
          body: JSON.stringify({
               message: 'Hello World',
               input: event,
          })
     };

     const body = JSON.parse(event.body);
     console.log(body);

     console.log(jp.value(schema.models, '$[?(@.$id == "http://home.weavver.com/schema/identityCreate.json")].properties.email', {"type": "string", "format": "email", "email_is_not_in_use": true }));
     console.log(jp.value(schema.models, '$[?(@.$id == "http://home.weavver.com/schema/identityCreate.json")].properties.phone_number', {"type": "string", "twilio_validate": true }));
     // console.log(jp.query(schema.models, '$[?(@.$id == "http://home.weavver.com/schema/identityCreate.json")].properties.phone_number'));

     var ajv = new Ajv({schemas: schema.models});

     ajv.addKeyword('twilio_validate', { async: true, type: 'string',
               validate: async (schema, data) => {
                    console.log(schema);
                    console.log("checking twilio validation service... (" + data + ")");
                    try {
                         await twilioclient.lookups.phoneNumbers(body.phone_number).fetch();
                         console.log("passed check..");
                         return true;
                    }
                    catch (err) {
                         console.log(err.message);
                         return false;
                    }

                    // console.log(number_info.national_format);
                    // console.log(number_info.country_code);
                    // // This will sometimes be null
                    // console.log(number_info.caller_name);
                    // create identity immediately if this is for a partner that is logged in?
               }
          });

     ajv.addKeyword('email_is_not_in_use', { async: true, type: 'string',
          validate: async (schema, data) => {
               console.log("validate email is available..");
               var q2 = gremlin.g.V()
                    .has('label','identity')
                    .has('cid', '0')
                    .has('email', body.email);

               var docs = await gremlin.executeQuery(q2);

               if (docs.length > 0) {
                    return false;
               }
               else {
                    return true;
               }
          }
     });

     var validate = ajv.getSchema('http://home.weavver.com/schema/identityCreate.json');
     try {
          var result = await validate(body);
          console.log(result);
     }
     catch (err) {
          console.log(err);
          await gremlin.close();
          response.statusCode = 422;
          response.body = JSON.stringify({message: "FAIL", err: err });
          return response;
     }

     var verificationcode = Math.floor((Math.random() * 100000) + 100000);
     try {
          var queryAddIdentity = gremlin.g.addV("identity")
                    .property('cid', "0")
                    .property('id', "identity_" + uuidv4())
                    .property('name', body.email)
                    .property('email', body.email)
                    .property('password_hash', bcrypt.hashSync(body.password, 10))
                    .property('verification_code', verificationcode);
          await gremlin.executeQuery(queryAddIdentity);

          await gremlin.close();
     }
     catch (err) {
          console.log("err: " + err);
          await gremlin.close();
          response.statusCode = 400;
          response.body = JSON.stringify({message: "FAIL", err: err });
          return response;
     }

     // send welcome email
     const sgMail = require('@sendgrid/mail');
     sgMail.setApiKey(process.env.SENDGRID_KEY);

     var data = { code: verificationcode };
     console.log(data);

     const msg = {
          to: body.email,
          from: 'noreply@weavver.com',
          subject: 'Verification Code',
          text: 'An email client compatible with HTML emails is required.',
          html: await templates.renderTemplate("/identities/identity_verification_required", data)
     };
     try {
          var sendGridResult = await sgMail.send(msg);
          response.statusCode = 200;
          return response;
     }
     catch (err) {
          console.log(err);
          response.statusCode = 422;
          response.body = JSON.stringify({message: "FAIL", err: err });
          return response;
     }
}