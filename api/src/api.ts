import 'reflect-metadata'
import fastify, { HTTPInjectOptions, HTTPMethod } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http'
import fs from 'fs';
import path from 'path';

import { APIGatewayProxyEvent, Context } from "aws-lambda";

var now = require("performance-now");

import { EchoRoute } from './echo/echo';
import { TokensGetRoute } from './tokens/tokens_get';
import { TokensDelRoute } from './tokens/tokens_del';
import { PasswordsGetRoute } from './password/passwords_get';
import { PasswordsPutRoute } from './password/passwords_put';
import { IdentitiesPutRoute } from './identities/identities_put';
import { HomeApolloServer } from './apollo-server';

import * as promclient from 'prom-client';
import { Http2SecureServer, Http2ServerResponse } from 'http2';
import { GremlinHelper } from './gremlin';

// var ResponseTime = require('response-time');  
// var Logger = require('./logger');

export interface CustomIncomingMessage extends IncomingMessage {
     summary: promclient.Summary<any>;
     end: any;
}

// var c : any;
// if (!c) {
//      c = new Counter({
//                name: 'test_counter',
//                help: 'Example of a counter',
//                labelNames: ['url', 'code']
//           });
//      }

var os = require('os');

export interface Query {
     foo?: number
}

export class API {
     gremlin : GremlinHelper;
     app : fastify.FastifyInstance<Server, CustomIncomingMessage, ServerResponse>;
     opts : fastify.RouteShorthandOptions = {
          // schema: {
          //      response: {
          //           200: {
          //                type: 'object',
          //                properties: {
          //                     pong: {
          //                          type: 'string'
          //                     }
          //                }
          //           }
          //      }
          // }
     };

     //#region Utilities
     format(seconds : any){
          function pad(s : any){
               return (s < 10 ? '0' : '') + s;
          }
          var hours : any = Math.floor(seconds / (60*60));
          var minutes : any = Math.floor(seconds % (60*60) / 60);
          var seconds : any = Math.floor(seconds % 60);
     
          return pad(hours) + ' hour(s) ' + pad(minutes) + ' minute(s) ' + pad(seconds) + ' second(s)';
     }
     //#endregion

     constructor(enableSSL : boolean) {
          this.gremlin = new GremlinHelper();
          var config : any = { https: {} };
          if (enableSSL) {
               // http2: true,
               config.https = {
                    key: fs.readFileSync(path.join(__dirname, '../certificates/server.key')),
                    cert: fs.readFileSync(path.join(__dirname, '../certificates/server.cert'))
               };
          };
          this.app = fastify() as unknown as fastify.FastifyInstance<Server, CustomIncomingMessage, ServerResponse>;

          const fastifyTimeout = require('fastify-server-timeout')
          this.app.register(fastifyTimeout, { serverTimeout: 5000  }); // time is in milliseconds
          this.app.register(require('fastify-cookie'), {
                    secret: "akjsdflkasdjfloijasdf", // for cookies signature
                    parseOptions: {}     // options for parsing cookies
               });

          this.app.register(require('fastify-cors'), { 
                    origin: true,
                    credentials: true
               });

          // required to process oauth2 content-type of "application/x-www-form-urlencoded"
          this.app.register(require('fastify-formbody'))
     }

     async init() {
          await this.gremlin.init();
          await this.setRoutes();
     }

     async setRoutes() {
          this.app.get('/', this.opts, async (request, reply) => {
               reply.code(200).send({
                    message: "we are online",
                    process_uptime: this.format(process.uptime()),
                    system_uptime: this.format(os.uptime)
               });
          });

          // routes
          let echo = new EchoRoute(this);
          let tokens = new TokensGetRoute(this);
          let tokens_del = new TokensDelRoute(this);
          let passwords_get = new PasswordsGetRoute(this);
          let passwords_set = new PasswordsPutRoute(this);
          let identities_post = new IdentitiesPutRoute(this);
          let home = new HomeApolloServer(this).getFastifyServer();

          // this.app.get('*', async (request, reply) => {
          //      console.log("Idkwist: There's nowhere like home. Home is now <a href='%s'>here.</a>", process.env.WEBSITE_DOMAIN);
          // });
     }

     async dispose () {
          await this.gremlin.close();
     }
}