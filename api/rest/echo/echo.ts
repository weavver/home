import { APIGatewayProxyEvent, Context } from "aws-lambda";

import { GremlinHelper } from '../../gremlin';
let gremlin = new GremlinHelper();
let counter = 0;

export const handler = async (event : APIGatewayProxyEvent, context : Context) => {
     var date = new Date();
     date.setTime(+date + (1 * 86400000)); // Get Unix milliseconds at current time plus 1 days: 24 \* 60 \* 60 \* 100
     var cookieVal = Math.random().toString(36).substring(7); // Generate a random cookie string

     if (Math.round(Math.random()) == 1) {
          cookieVal = "true";
     }
     else {
          cookieVal = "false";
     }

    var query = gremlin.g.V();
        // .property("Field4", "2");
    var result = await gremlin.executeQuery(query); 
    
     var cookieString = "ExampleCookie=" + cookieVal + ";domain=" + process.env.WEBSITE_DOMAIN + "; expires=" + date.toUTCString() + ";";
     const response = {
          statusCode: 200,
          headers: {
               'Access-Control-Allow-Origin': '*', // Required for CORS support to work,
               'Set-Cookie': cookieString
          },
          body: JSON.stringify({
               message: 'Hello World ' + counter,
               command_time: result.command_time,
               input: event,
          })
     };
     counter++;

     context.callbackWaitsForEmptyEventLoop = false;
     return response;
};

export const clear = async () => {
     return await gremlin.client.close();
}