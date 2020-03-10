import { GremlinHelper } from '../../gremlin';
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { HTTPResponseType } from '../common/http-response-type';

require('dotenv').config({ path: '.env' })

import * as fastify from 'fastify'

var bcrypt = require('bcryptjs');
import * as templates from '../templates';

export class PasswordsPutRoute {
     constructor(app : fastify.FastifyInstance | null, opts : any | null) {
          if (app) {
               app.put('/passwords', opts, async (request, reply) => {
                    console.log(request.query);
                    let result = await this.handler(request.body);
                    console.log(result);
                    reply.code(result.statusCode).send(result.body);
               });
          }
     }

     public async handler(body : any) : Promise<HTTPResponseType> {
          console.log(body);

          var response : HTTPResponseType = { statusCode: 500, body: "internal server error" };
          let gremlin = new GremlinHelper();
          try {
               if (process.env.DEBUG) console.log(body);

               var qCheckExistingPassword = gremlin.g.V()
                    .hasLabel('identity')
                         .has('cid', 0)
                         .has('email', body.email.toLowerCase())
                         .valueMap(true);

               var result = await gremlin.command(qCheckExistingPassword);
               console.log(result);
               if (!(result.result.length > 0)) {
                    throw new Error("Account not found.");
               }

               var doc = result.result[0];
               console.log("validating password..");
               if (bcrypt.compareSync(body.password_current, doc.password_hash[0]))
               {
                    var qUpdatePassword = gremlin.g.V()
                         .hasLabel('identity')
                              .has('cid', 0)
                              .has('email', body.email)
                              .property("password_hash", bcrypt.hashSync(body.password_new, 10));

                    var result = await gremlin.command(qUpdatePassword);
                    console.log("result: ", result);
                    console.log(result.length);

                    if (process.env.DEBUG) console.log(result);
                    if (result.result.length > 0) {
                         response.statusCode = 200;
                         response.body = JSON.stringify({ message: "Updated" });
                    }
                    else {
                         response.statusCode = 404;
                         response.body = JSON.stringify({ message: "Not found" });
                         return response;
                    }
               }
               else {
                    response.statusCode = 404;
                    response.body = JSON.stringify({ message: "Not found" });
                    return response;
               }
               await gremlin.close();
          }
          catch (err) {
               console.log(err);

               response.statusCode = 500;
               return response;
          }
          
          // email notify that password changed

          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_KEY);

          const msg = {
               to: body.email,
               from: 'noreply@weavver.com',
               subject: 'Password Reset',
               text: 'An email client compatible with HTML emails is required.',
               html: await templates.renderTemplate("/password/password_changed", {})
          };
          try {
               var sendGridResult = await sgMail.send(msg);
               response.statusCode = 200;
               return response;
          }
          catch (err) {
               console.log(err);
               response.statusCode = 422;
               response.body = JSON.stringify({message: "FAIL", err: err });
               return response;
          }
     }
}

// aws lambda helper method
export const handler = async function (event : APIGatewayProxyEvent, context : Context) : Promise<any> {
     // performance help
     context.callbackWaitsForEmptyEventLoop = false;
     console.log(event);

     if (!event || !event.queryStringParameters || !event.queryStringParameters.email)
          throw new Error("no query string parameters");

     let route = new PasswordsPutRoute(null, null);
     var response = await route.handler(JSON.parse(event.body as string));
     try {
          response.body = JSON.parse(response.body);
      } catch (e) {
           response.statusCode = 500;
           response.body = "internal server error";
      }
     return response;
}

