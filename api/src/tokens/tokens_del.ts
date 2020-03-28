import { GremlinHelper } from '../gremlin';
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { HTTPResponseType } from '../common/http-response-type';

import * as fastifyCookie from "fastify-cookie";
import * as fastify from 'fastify'

const uuidv4 = require('uuid/v4');

let gremlin = new GremlinHelper();

export class TokensDelRoute {

     constructor(app : fastify.FastifyInstance | null, opts : any | null) {
          if (app) {
               app.delete('/tokens', opts, async (request, reply) => {
                    console.log(request.query);
                    // console.log(request);
                    let result = await this.handler(request);

                    reply.code(result.statusCode)
                         .clearCookie("SessionToken", result.cookieOptions)
                         .send(result.body);
               });
          }
     }

     public async handler(request : any) {
          console.log("deleting token..");

          var response : HTTPResponseType = {
               statusCode: 500,
               body: "internal service error",
               cookieOptions: {
                         "domain": process.env.COOKIE_DOMAIN,
                         "path": process.env.COOKIE_PATH,
                         // "expires": date,
                         "HttpOnly": true,
                         "Secure": true,
                         "sameSite": "lax"
                    }
          };
          try {
               // console.log("storing deleted token to database...");
               // var queryAddIdentity = gremlin.g.addV("tokens")
               //           .property('cid', "0")
               //           .property('id', "tokens_" + uuidv4())
               //           .property('token', event.pathParameters.id)
               //           .property('expired', true);
               // var result = await gremlin.executeQuery(queryAddIdentity);
               // console.log("completed..");
               // console.log(result);
               // await gremlin.close();
               response.statusCode = 200;
               response.body = "";
               return response;
          }
          catch (err) {
               console.log("error...");
               console.log(err);
          }
          return response;
     };

     public async clear() {
          // if (gremlin.client) return await gremlin.client.close() 
          // else return;
     }
}