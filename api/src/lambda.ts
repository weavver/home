
import { API } from "./api";
import { HTTPMethod } from 'fastify';
import { HomeApolloServer } from './home-apollo-server';

import { Callback, Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

var api = new API();

// aws lambda helper method
export const handler_rest = async function (event : APIGatewayProxyEvent, context : Context) : Promise<any> {
     // performance help
     context.callbackWaitsForEmptyEventLoop = false;

     console.log(event.path);
     const injection_data = {
          url: event.path,
          method: event.httpMethod as HTTPMethod,
          headers: { origin: "dev.example.com" },
          query: {} // { email: 'is_in_use@example.com', password: 'asdfasdf1234' }
     };
     // if (event.queryStringParameters)
     //      injection_data.query = event.queryStringParameters;


     const response = await api.app.inject(injection_data);
     const lambda_response = {
          statusCode: response.statusCode,
          headers: response.headers,
          body: response.payload
          // statusCode: 200,
          // body: JSON.stringify(event)
     };
     return lambda_response;
}


// this is used by serverless.yml to help bypass compatibility issues between fastify
//     and apolloserver while using serverless-offline and aws api gateway
export const handler_apollo = function (event : APIGatewayProxyEvent, context : Context, callback : Callback<APIGatewayProxyResult>) {
     let api = new API();
     console.log("creating lambda handler");
          return new HomeApolloServer(api).getLambdaServer().createHandler({
          cors: {
               credentials: true,
               origin: ['https://' + process.env.WEBSITE_DOMAIN]
         }
     })(event, context, callback);
}
