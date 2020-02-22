const bcrypt = require('bcryptjs');
var moment = require("moment");
var templates = require('../templates.js');
var gremlin = require('../../gremlin.js');

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

     console.log(body);

     var validate = ajv.getSchema('http://home.weavver.com/schema/identityPasswordReset.json');
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
          var q = gremlin.g.V()
               .has('label','identity')
               .has('cid', '0')
               .has('email', body.email);

          var docs = await gremlin.executeQuery(q);

          if (docs.length > 0) {
          }
          else {
               await gremlin.close();
               throw new Error("Identity not found.");
          }

          var reset_code = Math.floor(10000000 + Math.random() * 90000000);

          console.log(docs._items[0]);
          // console.log(moment().toDate());
          var newDateObj = moment().add(45, 'm');

          console.log(docs._items[0].id);

          var qUpdate = gremlin.g.V(docs._items[0].id)
               .property('password_resetcode', reset_code)
               .property('password_resetcode_expires_at', newDateObj.toDate().toISOString());

          var updateResponse = await gremlin.executeQuery(qUpdate);

          // console.log("updateResponse: ");
          // console.log(updateResponse);

          if (updateResponse.length > 0) {
               response.statusCode = 200;
               response.body = { message: "Updated" };
          }
          else {
               response.statusCode = 404;
               response.body = { message: "Not found" };
          }
          await gremlin.close();
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