import { app } from "../home-api";
import { HTTPInjectResponse, HTTPMethod } from 'fastify';

import { APIGatewayProxyEvent, Context } from "aws-lambda"

export class HTTPHelper {
     static async getResponse(method : HTTPMethod, route : any, query : any, postdata? :any) {
          const response : HTTPInjectResponse = await app.inject({
               method: method,
               headers: {},
               url: route,
               query: query,
               payload: postdata
          });

          return response;
     }
}