import { API } from '../api';
import { BaseRoute, RouteEvent } from '../baseroute';
import { GremlinHelper } from '../gremlin';

import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { HTTPResponseType } from '../common/http-response-type';

import * as fastifyCookie from "fastify-cookie";
import * as fastify from 'fastify'

const uuidv4 = require('uuid/v4');

import * as templates from '../templates';
import * as schema from '../../schema';
var jp = require('jsonpath');
var Ajv = require('ajv');

// const twilioclient = require('twilio')(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);

var bcrypt = require('bcryptjs');

export class IdentitiesPutRoute  extends BaseRoute {
     constructor(api : API) {
          super(api, "PUT", "/identities");
     }

     public async handler(event : RouteEvent) : Promise<void> {
          var response : HTTPResponseType = {
               statusCode: 500,
               body: "internal service error"
          };

          jp.value(schema.models, '$[?(@.$id == "http://home.weavver.com/schema/identityCreate.json")].properties.email', {"type": "string", "format": "email", "email_is_available": true });
          jp.value(schema.models, '$[?(@.$id == "http://home.weavver.com/schema/identityCreate.json")].properties.phone_number', {"type": "string", "twilio_validate": true });
          // console.log(jp.query(schema.models, '$[?(@.$id == "http://home.weavver.com/schema/identityCreate.json")].properties.phone_number'));

          var ajv = new Ajv({schemas: schema.models});

          ajv.addKeyword('twilio_validate', { async: true, type: 'string',
                    validate: async (schema : any, data : any) => {
                         try {
                              // await twilioclient.lookups.phoneNumbers(data).fetch();
                              return true;
                         }
                         catch (err) {
                              return false;
                         }

                         // console.log(number_info.national_format);
                         // console.log(number_info.country_code);
                         // // This will sometimes be null
                         // console.log(number_info.caller_name);
                         // create identity immediately if this is for a partner that is logged in?
                    }
               });

          ajv.addKeyword('email_is_available', { async: true, type: 'string',
               validate: async (schema : any, email : any) => {
                    var qCheckEmailisNotInUser = this.api.gremlin.g.V()
                         .hasLabel('identity')
                         .has('email', email);

                    var docs = await this.api.gremlin.command(qCheckEmailisNotInUser);
                    if (docs.result.length > 0) {
                         return false;
                    }
                    else {
                         return true;
                    }
               }
          });

          var validate = ajv.getSchema('http://home.weavver.com/schema/identityCreate.json');
          try {
               var result = await validate(event.request.body);
               // console.log(result);
          }
          catch (err) {
               // console.log(err);
               response.statusCode = 422;
               response.body = { message: "FAIL", err: err };
               event.reply.code(response.statusCode).send(response.body);
               return;
          }

          var verificationcode = Math.floor((Math.random() * 100000) + 100000);
          try {
               var queryAddIdentity = this.api.gremlin.g.addV("identity")
                         .property('cid', 0)
                         // .property('id', "identity_" + uuidv4())
                         .property('name', event.request.body.email)
                         .property('email', event.request.body.email)
                         .property('password_hash', bcrypt.hashSync(event.request.body.password, 10))
                         .property('verification_code', verificationcode);
               let cmdResponse = await this.api.gremlin.command(queryAddIdentity);
               // console.log("created new identity with id of " + cmdResponse.result[0].id);

               // await gremlin.close();
          }
          catch (err) {
               // console.log("err: " + err);
               response.statusCode = 400;
               response.body = { message: "FAIL", err: err };
               event.reply.code(response.statusCode).send(response.body);
               return;
          }

          // send welcome email
          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_KEY);

          var data = { code: verificationcode };
          // console.log(data);

          const msg = {
               to: event.request.body.email,
               from: 'noreply@weavver.com',
               subject: 'Verification Code',
               text: 'An email client compatible with HTML emails is required.',
               html: await templates.renderTemplate("/identities/identity_verification_required", data)
          };
          try {
               var sendGridResult = await sgMail.send(msg);
               response.statusCode = 200;
               response.body = "";
               event.reply.code(response.statusCode).send(response.body);
               return;
          }
          catch (err) {
               console.log(err);
               response.statusCode = 422;
               response.body = {message: "FAIL", err: err };
               event.reply.code(response.statusCode).send(response.body);
               return;
          }
     }
}