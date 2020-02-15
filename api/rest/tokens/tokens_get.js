'use strict';

require('dotenv').config({ path: '.env' })

var bcrypt = require('bcryptjs');
var moment = require("moment");

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

     const MongoClient = require('mongodb').MongoClient;
     const connectedClient = await MongoClient.connect(process.env.MONGODB_URL);
     const mongodb = connectedClient.db(process.env.MONGODB_DATABASE);
     try {
          const doc = await mongodb.collection('identities').findOne({ "email": event.queryStringParameters.email.toLowerCase() });
          if (doc == null) {
               throw new Error("Account not found.");
          }

          var passwordhashed = bcrypt.hashSync(event.queryStringParameters.password, doc.password_hash);
          if (await bcrypt.compareSync(event.queryStringParameters.password, doc.password_hash))
          {
               console.log("matching");
               response.headers['Set-Cookie'] = cookieString;
               await connectedClient.close();
          } else {
               console.log(event.queryStringParameters.password);
               throw new Error("Password does not match");
          }
     }
     catch (err) {
          await connectedClient.close();
          response.statusCode = 401;
          console.log(err);
     }
     return response;
}