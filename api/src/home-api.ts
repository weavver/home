
import fastify from 'fastify';

import { Server, IncomingMessage, ServerResponse } from 'http'
import 'reflect-metadata'

const serverless = require('serverless-http');

import { EchoRoute } from './echo/echo';
import { TokensGetRoute } from './tokens/tokens_get';
import { TokensDelRoute } from './tokens/tokens_del';
import { PasswordsGetRoute } from './password/passwords_get';
import { PasswordsPutRoute } from './password/passwords_put';
import { IdentitiesPutRoute } from './identities/identities_put';
import { HomeApolloServer } from './graphql/home-apollo-server';

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

const app: fastify.FastifyInstance = fastify({})
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

const plugin = require('fastify-server-timeout')

app.register(plugin, {
     serverTimeout: 5000 //ms
   });

app.register(require('fastify-cookie'), {
          secret: "akjsdflkasdjfloijasdf", // for cookies signature
          parseOptions: {}     // options for parsing cookies
     });

app.register(require('fastify-cors'), { 
          origin: true,
          credentials: true
     });

app.get('/', opts, async (request, reply) => {
     reply.code(200).send({
          message: "we are online",
          process_uptime: format(process.uptime()),
          system_uptime: format(os.uptime)
     });
});

module.exports.handler = serverless(app);

let echo = new EchoRoute(app, opts);
let tokens = new TokensGetRoute(app, opts);
let tokens_del = new TokensDelRoute(app, opts);
let passwords_get = new PasswordsGetRoute(app, opts);
let passwords_set = new PasswordsPutRoute(app, opts);
let identities_post = new IdentitiesPutRoute(app, opts);
let home = new HomeApolloServer(app);

export { app } ;
