import { GremlinHelper } from '../../gremlin';
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { HTTPResponseType } from '../common/http-response-type';

import * as fastifyCookie from "fastify-cookie";
import * as fastify from 'fastify'

var cookie = require('cookie');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var moment = require("moment");

let gremlin = new GremlinHelper();

export class TokensGetRoute {

     constructor(app : fastify.FastifyInstance | null, opts : any | null) {
          if (app) {
               app.get('/tokens', opts, async (request, reply) => {
                    console.log(request.query);
                    // console.log(request);
                    let result = await this.handler(request.query);

                    if (result.cookieToken) {
                         reply.code(result.statusCode)
                              .setCookie("SessionToken", result.cookieToken, result.cookieOptions)
                              .send(result.body);
                    } else {
                         reply.code(result.statusCode)
                              .clearCookie("SessionToken", result.cookieOptions)
                              .send(result.body);
                    }
               });
          }
     }

     public async handler(query : any) {
          // var newDateObj = moment().add(14, 'd');
          var date = new Date();
          date.setTime(+date + (1 * 86400000));

          var response : HTTPResponseType = {
               statusCode: 500,
               body: "internal service error",
               cookieOptions: {
                         "domain": process.env.COOKIE_DOMAIN,
                         "path": process.env.COOKIE_PATH,
                         "expires": date,
                         "HttpOnly": true,
                         "Secure": true,
                         "sameSite": "lax"
                    }
          };

          if (!query || !query.email)
               throw new Error("no query string parameters");

          var token = null;
          try {
               console.log("getting token of " + query.email.toLowerCase());

               var qGetIdentity : any = gremlin.g.V()
                    .hasLabel('identity')
                    .has('cid', '0')
                    .has('email', query.email.toLowerCase())
                    .valueMap(true);

               var cmdResponse = await gremlin.command(qGetIdentity);

               // console.log(docs);

               if (!(cmdResponse.result.length > 0)) {
                    throw new Error("Identity not found.");
               }

               var doc = cmdResponse.result[0];

               console.log("validating password..");
               // console.log(doc.password_hash[0]);
               // console.log(query.password);
               // var passwordhashed = bcrypt.hashSync(query.password); // doc.password_hash[0]);
               // console.log(passwordhashed);
               if (bcrypt.compareSync(query.password, doc.password_hash[0]))
               {
                    console.log("it matches...");
                    response.statusCode = 200;
                    var token_data = {
                         sub: "123123123",
                         name: "Gen Apple",
                         email: query.email // to remove later
                    };
                    response.cookieToken = jwt.sign(token_data, process.env.COOKIE_JWT_SIGNING_SECRET, { expiresIn: 60 * 60 });
                    response.body = cmdResponse.command_time;;
               }
               else {
                    // passwords do not match
                    // console.log(query.password);
                    response.statusCode = 401;
                    response.cookieToken = null;
                    response.body = "";
               }
          }
          catch (err) {
               response.statusCode = 500;
               response.cookieToken = null;
               console.log(err);
          }
          return response;
     }

     public async clear() {
          // return await gremlin.client.close();
     }
}

// aws lambda helper method
export const handler = async function (event : APIGatewayProxyEvent, context : Context) : Promise<any> {
     // performance help
     context.callbackWaitsForEmptyEventLoop = false;

     if (!event || !event.queryStringParameters || !event.queryStringParameters.email)
          throw new Error("no query string parameters");

     let route = new TokensGetRoute(null, null);
     let response = await route.handler(event.queryStringParameters);

     var cookieString = cookie.serialize('SessionToken', response.cookieToken, response.cookieOptions);
     console.log("setting cookie", cookieString);
     response.headers["Set-Cookie"] = cookieString;
     return response;
}