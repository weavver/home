
var templates = require('../templates.js');
var jp = require('jsonpath');

var schema = require('../../schema.js');
var Ajv = require('ajv');

const twilioclient = require('twilio')(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);

exports.handler =  async function (event, context) {

     const MongoClient = require('mongodb').MongoClient;
     const connectedClient = await MongoClient.connect(process.env.MONGODB_URL);
     const mongodb = connectedClient.db(process.env.MONGODB_DATABASE);

     const body = JSON.parse(event.body);
     console.log(body);

     console.log(jp.value(schema.models, '$[?(@.$id == "http://accounts.weavver.com/schema/accountCreate.json")].properties.email', {"type": "string", "format": "email", "email_is_not_in_use": true }));
     console.log(jp.value(schema.models, '$[?(@.$id == "http://accounts.weavver.com/schema/accountCreate.json")].properties.phone_number', {"type": "string", "twilio_validate": true }));
     // console.log(jp.query(schema.models, '$[?(@.$id == "http://accounts.weavver.com/schema/accountCreate.json")].properties.phone_number'));

     var ajv = new Ajv({schemas: schema.models});

     ajv.addKeyword('twilio_validate', {
               async: true,
               type: 'string',
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
                    // create the account immediate if this is for a partner that is logged in?
               }
          });

     ajv.addKeyword('email_is_not_in_use', {
          async: true,
          type: 'string',
          validate: async (schema, data) => {
               console.log("validate email is available..");
               const doc = await mongodb.collection("accounts").findOne({ email: body.email });
               console.log(doc);

               if (doc) {
                    return false;
               }
               else {
                    return true;
               }
          }
     });

     var validate = ajv.getSchema('http://accounts.weavver.com/schema/accountCreate.json');
     try {
          var result = await validate(body);
          console.log(result);
     }
     catch (err) {
          console.log(err);
          await connectedClient.close();
          return { status_code: 422, errors: err.errors};
     }

     try {
          body.verification = { email : { code: Math.floor((Math.random() * 100000) + 100000) } };

          const docs = await mongodb.collection('accounts').insertOne(body);
          console.log(docs.insertedId);
          await connectedClient.close();
     }
     catch (err) {
          console.log(err);
          await connectedClient.close();
          return { status_code: 400, message: "FAIL", err: err };
     }

     const sgMail = require('@sendgrid/mail');
     sgMail.setApiKey(process.env.SENDGRID_KEY);

     var data = {  };
     console.log(data);

     const msg = {
          to: body.email,
          from: 'noreply@weavver.com',
          subject: 'Verification Code',
          text: 'An email client compatible with HTML emails is required.',
          html: await templates.renderTemplate("/account/account_verification_required", data)
     };
     try {
          var sendGridResult = await sgMail.send(msg);
          return { status_code: 200 };
     }
     catch (err) {
          console.log(err);
          return { status_code: 422, error: err };
     }
}