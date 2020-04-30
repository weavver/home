import { API, CustomIncomingMessage } from './api';
import { Server, IncomingMessage, ServerResponse } from 'http'

import * as fastify from 'fastify';
import * as fastifyCookie from "fastify-cookie";

export interface RouteEvent {
     request : fastify.FastifyRequest<CustomIncomingMessage, fastify.DefaultQuery, fastify.DefaultParams, fastify.DefaultHeaders, any>,
     reply : fastify.FastifyReply<ServerResponse>
}

export class BaseRoute {
     constructor(public api : API,
                 public method : string,
                 public path : string) {
          // console.log("Route " + method + ": ", path);
          switch (method) {
               case "GET":
                    api.app.get(path, api.opts, async (request, reply) => {
                         let result = await this.handler({ request: request, reply: reply });
                    });
                    break;

               case "POST":
                    api.app.post(path, api.opts, async (request, reply) => {
                         let result = await this.handler({ request: request, reply: reply });
                    });
                    break;

               case "DELETE":
                    api.app.delete(path, api.opts, async (request, reply) => {
                         let result = await this.handler({ request: request, reply: reply });
                    });
                    break;

               case "PUT":
                         api.app.put(path, api.opts, async (request, reply) => {
                              let result = await this.handler({ request: request, reply: reply });
                         });
                         break;
          }
     }

     public async handler(event : RouteEvent) : Promise<void> {};
}