import { GremlinHelper } from '../../gremlin';
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { HTTPResponseType } from '../common/http-response-type';

import * as fastifyCookie from "fastify-cookie";
import * as fastify from 'fastify'

const uuidv4 = require('uuid/v4');

import * as templates from '../templates';
import * as schema from '../../schema';
var jp = require('jsonpath');
var Ajv = require('ajv');

const twilioclient = require('twilio')(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);

var bcrypt = require('bcryptjs');

export class IdentitiesPutRoute {

     constructor(app : fastify.FastifyInstance | null, opts : any | null) {
          if (app) {
               app.put('/identities', opts, async (request, reply) => {
                    // console.log(request.body);
                    // console.log(request);
                    let result = await this.handler(request.body);
                    reply.code(result.statusCode)
                         .send(result.body);
               });
          }
     }

     public async handler(body : any) {
          let gremlin = new GremlinHelper();

          var response : HTTPResponseType = {
               statusCode: 500,
               body: "internal service error"
          };

          console.log(jp.value(schema.models, '$[?(@.$id == "http://home.weavver.com/schema/identityCreate.json")].properties.email', {"type": "string", "format": "email", "email_is_not_in_use": true }));
          console.log(jp.value(schema.models, '$[?(@.$id == "http://home.weavver.com/schema/identityCreate.json")].properties.phone_number', {"type": "string", "twilio_validate": true }));
          // console.log(jp.query(schema.models, '$[?(@.$id == "http://home.weavver.com/schema/identityCreate.json")].properties.phone_number'));

          var ajv = new Ajv({schemas: schema.models});

          ajv.addKeyword('twilio_validate', { async: true, type: 'string',
                    validate: async (schema : any, data : any) => {
                         console.log(schema);
                         console.log("checking twilio validation service... (" + data + ")");
                         try {
                              await twilioclient.lookups.phoneNumbers(data).fetch();
                              console.log("passed check..");
                              return true;
                         }
                         catch (err) {
                              console.log(err.message);
                              return false;
                         }

                         // console.log(number_info.national_format);
                         // console.log(number_info.country_code);
                         // // This will sometimes be null
                         // console.log(number_info.caller_name);
                         // create identity immediately if this is for a partner that is logged in?
                    }
               });

          ajv.addKeyword('email_is_not_in_use', { async: true, type: 'string',
               validate: async (schema : any, email : any) => {
                    console.log("validating that email is available to use..", email);
                    var qCheckEmailisNotInUser = gremlin.g.V()
                         .hasLabel('identity')
                         .has('cid', '0')
                         .has('email', email);

                    var docs = await gremlin.command(qCheckEmailisNotInUser);
                    console.log(docs);
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
               var result = await validate(body);
               console.log(result);
          }
          catch (err) {
               console.log(err);
               // await gremlin.close();
               response.statusCode = 422;
               response.body = { message: "FAIL", err: err };
               return response;
          }

          var verificationcode = Math.floor((Math.random() * 100000) + 100000);
          try {
               var queryAddIdentity = gremlin.g.addV("identity")
                         .property('cid', 0)
                         // .property('id', "identity_" + uuidv4())
                         .property('name', body.email)
                         .property('email', body.email)
                         .property('password_hash', bcrypt.hashSync(body.password, 10))
                         .property('verification_code', verificationcode);
               let cmdResponse = await gremlin.command(queryAddIdentity);
               console.log("created new identity with id of " + cmdResponse.result[0].id);

               // await gremlin.close();
          }
          catch (err) {
               console.log("err: " + err);
               await gremlin.close();
               response.statusCode = 400;
               response.body = { message: "FAIL", err: err };
               return response;
          }

          // send welcome email
          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_KEY);

          var data = { code: verificationcode };
          console.log(data);

          const msg = {
               to: body.email,
               from: 'noreply@weavver.com',
               subject: 'Verification Code',
               text: 'An email client compatible with HTML emails is required.',
               html: await templates.renderTemplate("/identities/identity_verification_required", data)
          };
          try {
               var sendGridResult = await sgMail.send(msg);
               response.statusCode = 200;
               response.body = "";
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