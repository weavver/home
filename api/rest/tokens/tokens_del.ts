import { APIGatewayProxyEvent, Context } from "aws-lambda";

const uuidv4 = require('uuid/v4');
import { GremlinHelper } from '../../gremlin';

export const handler = async (event : APIGatewayProxyEvent, context : Context) => {
     console.log("deleting token..");

     // if (!event || !event.pathParameters || !event.pathParameters.id)
     //      return;

     const response = {
          statusCode: 500,
          headers: {
               // 'Access-Control-Allow-Origin': event.headers.origin,
               'Access-Control-Allow-Origin': event.headers.origin,
               'Access-Control-Allow-Credentials': true,
               'Set-Cookie': "SessionToken=deleted;domain=" + process.env.COOKIE_DOMAIN + ";path=/" + process.env.API_STAGE + ";expires=Thu, 01 Jan 1970 00:00:00 GMT"
          },
          body: ""
     };

     try {
          // let gremlin = new GremlinHelper();
          // console.log("storing deleted token to database...");
          // var queryAddIdentity = gremlin.g.addV("tokens")
          //           .property('cid', "0")
          //           .property('id', "tokens_" + uuidv4())
          //           .property('token', event.pathParameters.id)
          //           .property('expired', true);
          // var result = await gremlin.executeQuery(queryAddIdentity);
          // console.log("completed..");
          // console.log(result);
          response.statusCode = 200;
          // await gremlin.close();
     }
     catch (err) {
          console.log("error...");
          console.log(err);
     }
     return response;
};