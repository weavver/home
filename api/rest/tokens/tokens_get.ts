import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { Query } from "type-graphql";

require('dotenv').config({ path: '.env' })

var bcrypt = require('bcryptjs');
var moment = require("moment");

import { GremlinHelper } from '../../gremlin';

var jwt = require('jsonwebtoken');

export const handler = async (event : APIGatewayProxyEvent, context : Context) => {
     if (!event || !event.queryStringParameters || !event.queryStringParameters.email)
          return;
          
     var token_data = {
          sub: "123123123",
          name: "Gen Apple",
          email: event.queryStringParameters.email // to remove later
     };
     var token = jwt.sign(token_data, "asdfasdfasdf", { expiresIn: 60 * 60 });
     
     var date = new Date();
     date.setTime(+date + (1 * 86400000));

     console.log(event.queryStringParameters.email);
     
     // var newDateObj = moment().add(14, 'd');
     var cookieString = "SessionToken=" + token + ";domain=" + process.env.COOKIE_DOMAIN + ";path=/" + process.env.API_VERSION + ";expires=" + date.toUTCString() + ";"; // HttpOnly; Secure";
     const response = {
          statusCode: 200,
          headers: {
               'Access-Control-Allow-Origin': event.headers.origin,
               'Access-Control-Allow-Credentials': true,
               'Set-Cookie': "null"
          },
          body: ""
     };

     let gremlin = new GremlinHelper();
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
               response.headers["Set-Cookie"] = cookieString;
          }
          else {
               console.log(event.queryStringParameters.password);
               throw new Error("Password does not match");
          }
     }
     catch (err) {
          response.statusCode = 401;
          console.log(err);
     }
     await gremlin.close();
     return response;
}