import { GremlinHelper } from '../../gremlin';
import { APIGatewayProxyEvent, Context } from "aws-lambda";

require('dotenv').config({ path: '.env' })

import * as fastify from 'fastify'

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var moment = require("moment");

let gremlin = new GremlinHelper();

export class TokensRoute {
     constructor(app : fastify.FastifyInstance | null, opts : any | null) {
          if (app) {
               app.get('/tokens', opts, async (request, reply) => {
                    console.log(request);
                    let result = await this.handler("origin", request.query);
                    reply.code(200).send(result);
               });
          }
     }

     public async handler(origin : any, query : any) {
          if (!query || !query.email)
               throw new Error("no query string parameters");

          var token_data = {
               sub: "123123123",
               name: "Gen Apple",
               email: query.email // to remove later
          };
          var token = jwt.sign(token_data, "asdfasdfasdf", { expiresIn: 60 * 60 });
          
          var date = new Date();
          date.setTime(+date + (1 * 86400000));

          console.log(query.email);
          
          // var newDateObj = moment().add(14, 'd');
          var cookieString = "SessionToken=" + token + ";domain=" + process.env.COOKIE_DOMAIN + ";path=/" + process.env.API_VERSION + ";expires=" + date.toUTCString() + ";HttpOnly; Secure;";
          const response = {
               statusCode: 200,
               headers: {
                    // 'Access-Control-Allow-Origin': event.headers.origin,
                    'Access-Control-Allow-Origin': origin, // event.headers.origin,
                    'Access-Control-Allow-Credentials': true,
                    'Set-Cookie': "null"
               },
               body: ""
          };

          try {
               console.log("getting token of " + query.email.toLowerCase());

               var query = gremlin.g.V()
                    .has('label','identity')
                    .has('cid', '0')
                    .has('email', query.email.toLowerCase());

               var docs = await gremlin.executeQuery(query);

               // console.log(docs);

               if (!(docs.length > 0)) {
                    throw new Error("Identity not found.");
               }

               var doc = docs._items[0];

               console.log("validating password..");
               console.log(doc.properties.password_hash[0].value);
               // var passwordhashed = bcrypt.hashSync(event.queryStringParameters.password, doc.properties.password_hash[0].value);
               // console.log(passwordhashed);
               if (bcrypt.compareSync(query.password, doc.properties.password_hash[0].value))
               {
                    console.log("it matches...");
                    console.log("setting cookie", cookieString);
                    response.headers["Set-Cookie"] = cookieString;
                    var data = {
                         email: query.email.toLowerCase()
                    }
                    response.body = JSON.stringify(data);
               }
               else {
                    console.log(query.password);
                    throw new Error("Password does not match");
               }
          }
          catch (err) {
               response.statusCode = 401;
               console.log(err);
          }
          return response;
     }

     public async clear() {
          return await gremlin.client.close();
     }
}

// aws lambda helper method
export const handler = async function (event : APIGatewayProxyEvent, context : Context) : Promise<any> {
     // performance help
     context.callbackWaitsForEmptyEventLoop = false;

     if (!event || !event.queryStringParameters || !event.queryStringParameters.email)
          throw new Error("no query string parameters");

     let tokensRoute = new TokensRoute(null, null);
     return await tokensRoute.handler(event.headers.origin, event.queryStringParameters);
}

// event.queryStringParameters.email