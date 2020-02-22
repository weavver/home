var gremlin = require('../../gremlin.js');

var bcrypt = require('bcryptjs');

var templates = require('../templates.js');

var response = {
     statusCode: 200,
     headers: {
          'Access-Control-Allow-Origin': '*'
     }
};

exports.handler =  async function (event, context) {
     console.log(event);

     const body = JSON.parse(event.body);
     console.log(body);

     try {
          if (process.env.DEBUG) console.log(body);

          var qCheckExistingPassword = gremlin.g.V()
               .has('label','identity')
               .has('cid', '0')
               .has('email', body.email.toLowerCase());

          var docs = await gremlin.executeQuery(qCheckExistingPassword);
          console.log(docs);
          if (!(docs.length > 0)) {
               throw new Error("Account not found.");
          }

          var doc = docs._items[0];
          console.log("validating password..");
          if (bcrypt.compareSync(body.password_current, doc.properties.password_hash[0].value))
          {
               var qUpdatePassword = gremlin.g.V()
                    .has('label','identity')
                    .has('cid', '0')
                    .has('email', body.email)
                    .property("password_hash", bcrypt.hashSync(body.password_new, 10));

               var result = await gremlin.executeQuery(qUpdatePassword);
               console.log("result: ");
               console.log(result.length);

               if (process.env.DEBUG) console.log(result);
               if (result.length > 0) {
                    response.statusCode = 200;
                    response.body = { message: "Updated" };
               }
               else {
                    response.statusCode = 404;
                    response.body = { message: "Not found" };
                    return response;
               }
          }
          else {
               response.statusCode = 404;
               response.body = { message: "Not found" };
               return response;
          }
          await gremlin.client.close();

     }
     catch (err) {
          console.log(err);

          response.statusCode = 500;
          return response;
     }
     
     // email notify that password changed

     const sgMail = require('@sendgrid/mail');
     sgMail.setApiKey(process.env.SENDGRID_KEY);

     const msg = {
          to: body.email,
          from: 'noreply@weavver.com',
          subject: 'Password Reset',
          text: 'An email client compatible with HTML emails is required.',
          html: await templates.renderTemplate("/password/password_changed")
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
