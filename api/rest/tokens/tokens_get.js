'use strict';

require('dotenv').config({ path: '.env' })

var bcrypt = require('bcryptjs');
var moment = require("moment");

var gremlin = require('../../gremlin.js');

module.exports.handler = async (event, context) => {
     
     var jwt = require('jsonwebtoken');
     var token_data = {
          sub: "123123123",
          name: "Gen Apple",
          email: event.queryStringParameters.email // to remove later
     };
     var token = jwt.sign(token_data, "asdfasdfasdf", { expiresIn: 60 * 60 });
     
     var date = new Date();
     date.setTime(+date + (1 * 86400000));
     
     // var newDateObj = moment().add(14, 'd');
     var cookieString = "SessionToken=" + token + ";domain=" + process.env.COOKIE_DOMAIN + ";path=/" + process.env.API_VERSION + ";expires=" + date.toGMTString() + ";"; // HttpOnly; Secure";
     const response = {
          statusCode: 200,
          headers: {
               'Access-Control-Allow-Origin': event.headers.origin,
               'Access-Control-Allow-Credentials': true
          },
          body: ""
     };

     try {
          console.log("getting token...");

          var q3 = gremlin.g.V()
               .has('label','identity')
               .has('cid', '0')
               .has('email', event.queryStringParameters.email.toLowerCase());

          var docs = await gremlin.executeQuery(q3);
          console.log(docs);
          if (!(docs.length > 0)) {
               throw new Error("Account not found.");
          }

          var doc = docs._items[0];

          console.log("validating password..");
          console.log(doc.properties.password_hash[0].value);
          // var passwordhashed = bcrypt.hashSync(event.queryStringParameters.password, doc.properties.password_hash[0].value);
          // console.log(passwordhashed);
          if (bcrypt.compareSync(event.queryStringParameters.password, doc.properties.password_hash[0].value))
          {
               console.log("matching");
               response.headers['Set-Cookie'] = cookieString;
               await gremlin.client.close();
          }
          else {
               console.log(event.queryStringParameters.password);
               throw new Error("Password does not match");
          }
     }
     catch (err) {
          await gremlin.client.close();
          response.statusCode = 401;
          console.log(err);
     }
     return response;
}