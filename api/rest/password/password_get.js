const bcrypt = require('bcryptjs');
var moment = require("moment");

var templates = require('../templates.js');

var response = {
     statusCode: 404,
     headers: {
          "Access-Control-Allow-Origin": "*" // Required for CORS support to work
     }
};

function renderToString(source, data) {
     var handlebars = require('handlebars');
     var template = handlebars.compile(source);
     var outputString = template(data);
     return outputString;
}

module.exports.handler = async function (event, context, callback) {
     const body = JSON.parse(event.body);

     var schema = require('../../schema.js');
     var Ajv = require('ajv');
     var ajv = new Ajv({schemas: schema.models});

     var code = Math.floor(10000000 + Math.random() * 90000000);

     console.log(body);

     var validate = ajv.getSchema('http://home.weavver.com/schema/accountPasswordReset.json');
     try {          
          var result = await validate(body);
         
     }
     catch (err) {
          console.log("error validating email...");
          console.log(err);

          response.statusCode = 404;
          response.body = err;
          return response;
     }

     try {
          const MongoClient = require('mongodb').MongoClient;
          const connectedClient = await MongoClient.connect(process.env.MONGODB_URL);
          const mongodb = connectedClient.db(process.env.MONGODB_DATABASE);

          var reset_code = Math.floor((Math.random() * 100000) + 100000);

          const doc = await mongodb.collection('accounts').findOne({ "email": body.email });
          if (doc == null) {
               await connectedClient.close();
               throw new Error("Account not found.");
          }
          console.log(doc);
          // console.log(moment().toDate());
          var newDateObj = moment().add(45, 'm');
          // console.log(newDateObj.toDate());
          var setdata = {
               $set: {
                    password_reset: {
                         code: reset_code,
                         expires_at: newDateObj.toDate()
                    }
               }
          };
          console.log(setdata);
          var update_result = await mongodb.collection("accounts").updateOne({ "_id" : doc._id }, setdata);
          console.log(update_result);
          if (update_result.modifiedCount == 1) {
               response.statusCode = 200;
               response.body = { message: "Updated" };
          }
          else {
               response.statusCode = 404;
               response.body = { message: "Not found" };
          }
          await connectedClient.close();
     }
     catch (err) {
          console.log(err);
          response.statusCode = 404;
          response.body = err;
          return response;
     }

     const sgMail = require('@sendgrid/mail');
     sgMail.setApiKey(process.env.SENDGRID_KEY);

     var data = { code: reset_code };
     console.log(data);

     const msg = {
          to: body.email,
          from: 'noreply@weavver.com',
          subject: 'Password Reset',
          text: 'An email client compatible with HTML emails is required.',
          html: await templates.renderTemplate("/password/password_reset", data)
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