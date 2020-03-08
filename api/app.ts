import * as fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import 'reflect-metadata'

import { EchoRoute } from './src/echo/echo';
import { TokensRoute } from './src/tokens/tokens_get';
import { HomeApolloServer } from './src/graphql/server';


console.log("weavver home server starting..");

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

app.get('/', opts, async (request, reply) => {
     reply.code(200).send("we are online");
});

(async function () {
     var echoRoute = new EchoRoute(app, opts);
     var tokensRoute = new TokensRoute(app, opts);
     let homeApolloServer = new HomeApolloServer();
     homeApolloServer.registerHandler(app);

     app.listen(3000, "0.0.0.0", (err, address) => {
          if (err) {
               console.log(err);
               app.log.error(err)
               process.exit(1)
          }
          console.log("starting... " + address);
          app.log.info("server listening on ${address}");
     });
})();