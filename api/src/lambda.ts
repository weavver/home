
import { API } from "./api";
import { HTTPMethod } from 'fastify';
import { HomeApolloServer } from './apollo-server';

import { Callback, Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

// var api = new API(false);

var initialized : boolean = false;

// aws lambda helper method
export const routes = async function (event : APIGatewayProxyEvent, context : Context) : Promise<APIGatewayProxyResult> {
     // if (!initialized) {
     //      await api.init();
     //      initialized = true;
     // }
     // // performance help
     // context.callbackWaitsForEmptyEventLoop = false;

     // console.log(event.path);
     // const injection_data = {
     //      url: event.path,
     //      method: event.httpMethod as HTTPMethod,
     //      headers: { origin: "dev.example.com" },
     //      query: {} // { email: 'is_in_use@example.com', password: 'asdfasdf1234' }
     // };
     // if (event.queryStringParameters)
     //      injection_data.query = event.queryStringParameters;


     // const response = await api.app.inject(injection_data);

     var response = {
          statusCode: 200,
          payload: "hello"
     }
     const lambda_response = {
          statusCode: response.statusCode,
          // headers: response.headers,
          body: response.payload
          // statusCode: 200,
          // body: JSON.stringify(event)
     };
     return lambda_response;
}


// this is used by serverless.yml to help bypass compatibility issues between fastify
//     and apolloserver while using serverless-offline and aws api gateway
export const graphql = async function (event : APIGatewayProxyEvent, context : Context, callback : Callback<APIGatewayProxyResult>) {
     // console.log("creating lambda handler");
     // return new HomeApolloServer(api).getLambdaServer().createHandler({
     //           cors: {
     //                credentials: true,
     //                origin: ['https://' + process.env.WEBSITE_DOMAIN]
     //      }
     //      })(event, context, callback);

     var response = {
          statusCode: 200,
          body: "hello"
     };

     return response;
}
