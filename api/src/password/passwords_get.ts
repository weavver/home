import { GremlinHelper } from '../gremlin';
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { HTTPResponseType } from '../common/http-response-type';

require('dotenv').config({ path: '.env' })

import * as fastify from 'fastify'

const bcrypt = require('bcryptjs');
var moment = require("moment");
import * as templates from '../templates';
import * as schema from '../../schema';
import { API } from '../api';
import { RouteEvent, BaseRoute } from '../baseroute';

// TODO: FIX SECURITY ISSUE WITH GREMLIN QUERY
export class PasswordsGetRoute extends BaseRoute {

     constructor(api : API) {
          super(api, "GET", "/passwords");
     }

     public async handler(event : RouteEvent) : Promise<void> {
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
          try {
               var q = this.api.gremlin.g.V()
                    .hasLabel('identity')
                    .has('email', event.request.query.email);

               var qGetIdentity = await this.api.gremlin.command(q);
               if (qGetIdentity.result.length > 0) {
               }
               else {
                    response.statusCode = 500;
                    throw new Error("Identity not found.");
               }

               var reset_code = Math.floor(10000000 + Math.random() * 90000000);
               var newDateObj = moment().add(45, 'm');
               var qUpdate = this.api.gremlin.g.V(qGetIdentity.result[0].id)
                    .property('password_resetcode', reset_code)
                    .property('password_resetcode_expires_at', newDateObj.toDate().toISOString());

               var updateResponse = await this.api.gremlin.command(qUpdate);
               // console.log("updateResponse:", updateResponse);
               if (updateResponse.result.length > 0) {
                    await this.sendResetEmail(event.request.query.email, reset_code.toString());
                    
                    response.statusCode = 200;
                    response.body = { message: "Reset code sent." };
                    event.reply.code(response.statusCode).send(response.body);
               }
               else {
                    response.statusCode = 500;
                    response.body = { message: "Internal error while storing reset code." };
               }
          }
          catch (err) {
               // console.log(err);
               response.statusCode = 404;
               response.body = err;
               event.reply.code(response.statusCode).send(response.body);
          }
     }

     async sendResetEmail(to : string, reset_code : string) : Promise<void> {
          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_KEY);

          var data = { code: reset_code };
          const msg = {
               to: to,
               from: 'noreply@weavver.com',
               subject: 'Password Reset',
               text: 'An email client compatible with HTML emails is required.',
               html: await templates.renderTemplate("/password/password_reset", data)
          };
          await sgMail.send(msg);
     }
}