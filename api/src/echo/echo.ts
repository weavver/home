import { GremlinHelper } from '../../gremlin';
import { APIGatewayProxyEvent, Context } from "aws-lambda";

import * as fastify from 'fastify'
var now = require("performance-now");

let gremlin = new GremlinHelper();
let counter = 0;

export class EchoRoute {
     constructor(app : fastify.FastifyInstance | null, opts : any | null) {
          if (app) {
               app.get('/echo', opts, async (request, reply) => {
                    let result = await this.handler(null);
                    reply.code(200).send(result);
               });
          }
     }

     public async handler(event : any) {
          var date = new Date();
          date.setTime(+date + (1 * 86400000)); // Get Unix milliseconds at current time plus 1 days: 24 \* 60 \* 60 \* 100
          var cookieVal = Math.random().toString(36).substring(7); // Generate a random cookie string

          cookieVal = (Math.round(Math.random()) == 1) ? "true" : cookieVal = "false";

          var qCreate = gremlin.g.addV("identity")
                         .property("center", 0)
                         .property("email", "is_in_use@example.com")
                         .property("password_hash", );

          var result2 = await gremlin.executeQuery(qCreate); 

          var query = gremlin.g.V();
          //      // .property("Field4", "2");
          var result = await gremlin.executeQuery(query); 
     
          var cookieString = "ExampleCookie=" + cookieVal + ";domain=" + process.env.WEBSITE_DOMAIN + "; expires=" + date.toUTCString() + ";";
          const response = {
               statusCode: 200,
               headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work,
                    'Set-Cookie': cookieString
               },
               body: {
                    message: 'Hello World ' + counter,
                    result: result,
                    input: event
               }
          };
          counter++;

          return response;
     };

     public async clear() {
          return await gremlin.client.close();
     }
}


let echoRoute = new EchoRoute(null, null);

// aws lambda helper method
export const handler = async function (event : APIGatewayProxyEvent, context : Context) : Promise<any> {
     // performance help
     context.callbackWaitsForEmptyEventLoop = false;

     echoRoute.handler(event);
}