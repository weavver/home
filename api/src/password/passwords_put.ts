import { API } from '../api';
import { RouteEvent, BaseRoute } from '../baseroute';
import { HTTPResponseType } from '../common/http-response-type';

require('dotenv').config({ path: '.env' })

import * as fastify from 'fastify'

var bcrypt = require('bcryptjs');
import * as templates from '../templates';

export class PasswordsPutRoute extends BaseRoute {
     constructor(api : API) {
          super(api, "PUT", "/passwords");
     }

     public async handler(event : RouteEvent) : Promise<void> {
          var response : HTTPResponseType = { statusCode: 500, body: "internal server error" };
          try {
               // if (process.env.DEBUG) console.log(event.request.body);

               var qCheckExistingPassword = this.api.gremlin.g.V()
                    .hasLabel('identity')
                         .has('cid', 0)
                         .has('email', event.request.body.email.toLowerCase())
                         .valueMap(true);

               var result = await this.api.gremlin.command(qCheckExistingPassword);
               // console.log(result);
               if (!(result.result.length > 0)) {
                    throw new Error("Account not found.");
               }

               var doc = result.result[0];
               // console.log("validating password..");
               if (bcrypt.compareSync(event.request.body.password_current, doc.password_hash[0]))
               {
                    var qUpdatePassword = this.api.gremlin.g.V()
                         .hasLabel('identity')
                              .has('cid', 0)
                              .has('email', event.request.body.email)
                              .property("password_hash", bcrypt.hashSync(event.request.body.password_new, 10));

                    var result = await this.api.gremlin.command(qUpdatePassword);
                    // console.log("result: ", result);
                    // console.log(result.length);

                    // if (process.env.DEBUG) console.log(result);
                    if (result.result.length > 0) {
                         response.statusCode = 200;
                         response.body = JSON.stringify({ message: "Updated" });
                    }
                    else {
                         response.statusCode = 404;
                         response.body = JSON.stringify({ message: "Not found" });
                         event.reply.code(response.statusCode).send(response.body);
                         return;
                    }
               }
               else {
                    response.statusCode = 404;
                    response.body = JSON.stringify({ message: "Not found" });
                    event.reply.code(response.statusCode).send(response.body);
                    return;
               }
          }
          catch (err) {
               console.log(err);

               response.statusCode = 500;
               event.reply.code(response.statusCode).send(response.body);
               return;
          }
          
          // email notify that password changed

          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_KEY);

          const msg = {
               to: event.request.body.email,
               from: 'noreply@weavver.com',
               subject: 'Password Reset',
               text: 'An email client compatible with HTML emails is required.',
               html: await templates.renderTemplate("/password/password_changed", {})
          };
          try {
               var sendGridResult = await sgMail.send(msg);
               response.statusCode = 200;
               event.reply.code(response.statusCode).send(response.body);
               return;
          }
          catch (err) {
               console.log(err);
               response.statusCode = 422;
               response.body = JSON.stringify({message: "FAIL", err: err });
               event.reply.code(response.statusCode).send(response.body);
               return;
          }
     }
}