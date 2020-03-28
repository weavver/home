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
import { HomeApolloServer } from './home-apollo-server';

import * as promclient from 'prom-client';
import { Http2SecureServer, Http2ServerResponse } from 'http2';

var Register = require('prom-client').register;  
var Counter = require('prom-client').Counter;  
var Histogram = require('prom-client').Histogram;  
var Summary = require('prom-client').Summary;  
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

function format(seconds : any){
     function pad(s : any){
          return (s < 10 ? '0' : '') + s;
     }
     var hours : any = Math.floor(seconds / (60*60));
     var minutes : any = Math.floor(seconds % (60*60) / 60);
     var seconds : any = Math.floor(seconds % 60);

     return pad(hours) + ' hour(s) ' + pad(minutes) + ' minute(s) ' + pad(seconds) + ' second(s)';
}

interface Query {
     foo?: number
}

// const app: fastify.FastifyInstance = fastify({})
// app.register(fastifyPlugin);

const app: fastify.FastifyInstance<Server, CustomIncomingMessage, ServerResponse> = fastify();
// const app: any = fastify({
//      // http2: true,
//      https: {
//        key: fs.readFileSync(path.join(__dirname, 'server.key')),
//        cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
//      }
// });

const opts: fastify.RouteShorthandOptions = {
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
}

// const metricsPlugin = require('fastify-metrics');
// app.register(metricsPlugin, {endpoint: '/metrics'});

// const summary = new Summary({
//      name: 'request_duration_echo',
//      help: 'metric_help',
//      maxAgeSeconds: 5
// });

// app.addHook('onRequest', (request, reply, done) => {
//      // console.log('a');
//      if (request.req.url == "/")
//           request.raw.end = now();
//           // request.raw.end = summary.startTimer();
//      // c.inc({ url: request.req.url, code: 200 });
//      done()
// })

// app.addHook('onResponse', (request, reply, done) => {
//      // console.log(request.raw.ctx);
//      done();
//      // if (request.raw.end)
//      //      summary.observe(now() - request.raw.end);
//           // request.raw.end();
//      // console.log('c');
// });

// app.get('/metrics', (req, res) => {
//      res.header('Content-Type', Register.contentType);
//      res.send(Register.metrics());
// });

const fastifyTimeout = require('fastify-server-timeout')
app.register(fastifyTimeout, { serverTimeout: 5000  }); // ms

app.register(require('fastify-cookie'), {
          secret: "akjsdflkasdjfloijasdf", // for cookies signature
          parseOptions: {}     // options for parsing cookies
     });

app.register(require('fastify-cors'), { 
          origin: true,
          credentials: true
     });

// app.get('/', opts, async (request, reply) => {
//      reply.code(200).send({
//           message: "we are online",
//           process_uptime: format(process.uptime()),
//           system_uptime: format(os.uptime)
//      });
// });

let echo = new EchoRoute(app, opts);
let tokens = new TokensGetRoute(app, opts);
let tokens_del = new TokensDelRoute(app, opts);
let passwords_get = new PasswordsGetRoute(app, opts);
let passwords_set = new PasswordsPutRoute(app, opts);
let identities_post = new IdentitiesPutRoute(app, opts);
let home = new HomeApolloServer().getFastifyServer(app);

// aws lambda helper method
export const handler = async function (event : APIGatewayProxyEvent, context : Context) : Promise<any> {
     // performance help
     context.callbackWaitsForEmptyEventLoop = false;

     // console.log(event.path);
     const injection_data = {
          url: event.path,
          method: event.httpMethod as HTTPMethod,
          headers: { origin: "dev.example.com" },
          query: {} // { email: 'is_in_use@example.com', password: 'asdfasdf1234' }
     };
     // if (event.queryStringParameters)
     //      injection_data.query = event.queryStringParameters;
     const response : fastify.HTTPInjectResponse = await app.inject(injection_data);
     const lambda_response = {
          statusCode: response.statusCode,
          headers: response.headers,
          body: response.payload
          // statusCode: 200,
          // body: JSON.stringify(event)
     };
     return lambda_response;
}

export { app };