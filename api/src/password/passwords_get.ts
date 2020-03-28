import { GremlinHelper } from '../gremlin';
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { HTTPResponseType } from '../common/http-response-type';

require('dotenv').config({ path: '.env' })

import * as fastify from 'fastify'

const bcrypt = require('bcryptjs');
var moment = require("moment");
import * as templates from '../templates';
import * as schema from '../../schema';

export class PasswordsGetRoute {
     constructor(app : fastify.FastifyInstance | null, opts : any | null) {
          if (app) {
               app.get('/passwords', opts, async (request, reply) => {
                    console.log(request.query);
                    let result = await this.handler("origin", request.query);
                    console.log(result);
                    reply.code(result.statusCode).send(result.body);
               });
          }

          var x = {
               Response: {
                    statusCode: 0,
                    body: "asdf" 
               }
          }
     }

     public async handler(origin : any, query : any) {
          // todo remove this

          // var Ajv = require('ajv');
          // var ajv = new Ajv({schemas: schema.models});

          // var validate = ajv.getSchema('http://home.weavver.com/schema/identityPasswordReset.json');
          // try {          
          //      var result = await validate(body);
          // }
          // catch (err) {
          //      console.log("error validating email...");
          //      console.log(err);

          //      response.statusCode = 404;
          //      response.body = err;
          //      return response;
          // }

          var response : HTTPResponseType = {
                    statusCode: 500,
                    body: "internal service error" 
               };
          let gremlin = new GremlinHelper();
          try {
               var q = gremlin.g.V()
                    .hasLabel('identity')
                         .has('cid', 0)
                         .has('email', query.email);

               var qGetIdentity = await gremlin.command(q);
               if (qGetIdentity.result.length > 0) {
               }
               else {
                    // await gremlin.close();
                    throw new Error("Identity not found.");
               }

               var reset_code = Math.floor(10000000 + Math.random() * 90000000);

               console.log(qGetIdentity.result[0]);
               // console.log(moment().toDate());
               var newDateObj = moment().add(45, 'm');

               console.log(qGetIdentity.result[0].id);

               var qUpdate = gremlin.g.V(qGetIdentity.result[0].id)
                    .property('password_resetcode', reset_code)
                    .property('password_resetcode_expires_at', newDateObj.toDate().toISOString());

               var updateResponse = await gremlin.command(qUpdate);

               console.log("updateResponse: ");
               console.log(updateResponse);

               if (updateResponse.result.length > 0) {
                    response.statusCode = 200;
                    response.body = { message: "Updated" };
               }
               else {
                    response.statusCode = 404;
                    response.body = { message: "Not found" };
               }
               // await gremlin.close();
          }
          catch (err) {
               console.log(err);
               response.statusCode = 404;
               response.body = err;
               return response;
          }

          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_KEY);

          var data = { code: reset_code };
          const msg = {
               to: query.email,
               from: 'noreply@weavver.com',
               subject: 'Password Reset',
               text: 'An email client compatible with HTML emails is required.',
               html: await templates.renderTemplate("/password/password_reset", data)
          };
          try {
               var sendGridResult = await sgMail.send(msg);
               response.statusCode = 200;
               return response;
          }
          catch (err) {
               console.log(err);
               response.statusCode = 422;
               response.body = {message: "FAIL", err: err };
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

     let route = new PasswordsGetRoute(null, null);
     var response = await route.handler(event.headers.origin, event.queryStringParameters);
     try {
          response.body = JSON.parse(response.body);
      } catch (e) {
           response.statusCode = 500;
           response.body = "internal server error: parse error";
      }
     return response;
}


// // add to lambda interpretation

// var bodyData = JSON.parse(event.body || '{}');
// if (!bodyData.email)
//      throw new Error("email not valid");


// var response = {
//      statusCode: 404,
//      headers: {
//           "Access-Control-Allow-Origin": "*" // Required for CORS support to work
//      },
//      body: ""
// };