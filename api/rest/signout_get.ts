import { APIGatewayProxyEvent, Context } from "aws-lambda";

const uuidv4 = require('uuid/v4');
var gremlin = require('../gremlin.js');

module.exports.handler = async function (event : APIGatewayProxyEvent, context : Context) {
     var redirect_url = "https://" + process.env.WEBSITE_DOMAIN;
     if (event && event.queryStringParameters && event.queryStringParameters.redirect_url) {
          redirect_url = event.queryStringParameters.redirect_url;
     }
     const response = {
          statusCode: 307,
          headers: {
               "Set-Cookie": "SessionToken=deleted;domain=" + process.env.COOKIE_DOMAIN + ";path=/" + process.env.API_VERSION + ";expires=Thu, 01 Jan 1970 00:00:00 GMT",
               Location: redirect_url
          },
          body: "Redirecting.. to https://" + redirect_url
     };

     try {
          if (!event || !event.pathParameters || !event.pathParameters.id) {
               throw Error("No token passed to signout with");
          } else {
               var token = event.pathParameters.id;
               var queryAddIdentity = gremlin.g.addV("tokens")
                         .property('cid', "0")
                         .property('id', "tokens_" + uuidv4())
                         .property('token', token)
                         .property('expired', true);
               await gremlin.executeQuery(queryAddIdentity);

               response.statusCode = 200;
          }
               await gremlin.close();
     }
     catch (err) {
          console.log(err);
     }
     return response;
}