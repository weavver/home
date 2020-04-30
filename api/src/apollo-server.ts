import { ApolloServer as ApolloServerFastify, Config as ConfigFastify, gql } from 'apollo-server-fastify';
import { ApolloServer as ApolloServerLambda, Config as ConfigLambda } from 'apollo-server-lambda';

import "reflect-metadata";
import * as path from "path";
import { Resolver, Query, buildSchema, buildSchemaSync } from "type-graphql"

import { CenterResolver } from "./centers/centers.resolver";
import { IdentityResolver } from "./identities/identities.resolver";
import { ApplicationsResolver } from "./applications/applications.resolver";
import { GremlinHelper } from './gremlin';
import { API } from './api';

var cookie = require('cookie');
var jwt = require('jsonwebtoken');

export interface Context {
     user?: {
          sub : number,
          email : string,
          iat : number,
          exp : number,
          roles : string[]
     },
     api : API,
     test : string
}

export class HomeApolloServer {

     constructor(public api : API) {}

     public getFastifyServer() : ApolloServerFastify {
          var server = new ApolloServerFastify(this.getParameters(this.api.gremlin) as ConfigFastify);

          // console.log("initializing in process graphql service...");
          this.api.app.register(server.createHandler({
                    cors: {
                         credentials: true,
                         origin: ['https://' + process.env.WEBSITE_DOMAIN]
                    }
               }));

          return server;
     }

     public getLambdaServer() : ApolloServerLambda {
          console.log("in getLambdaServer");
          let gremlin = new GremlinHelper();
          gremlin.init();
          return new ApolloServerLambda(this.getParameters(gremlin) as ConfigLambda);
     }

     public getParameters(gremlin: GremlinHelper) : any {
          return {
               schema: buildSchemaSync({
                    resolvers: [
                                   CenterResolver,
                                   IdentityResolver,
                                   ApplicationsResolver
                              ],
                    // emitSchemaFile: path.resolve(__dirname, "schema.gql"),
                    authChecker: ({ root, args, context, info }, roles) => {
                         console.log("args", args);
                         console.log("roles", roles);
                         console.log("info", info.fieldName);
                         // console.log("context", context);
                         if (context.user) {
                              console.log("context roles", context.user.roles);
                              if (roles.length == 0 || roles.indexOf("root") > -1) {
                                   return true;
                              }
                              else
                                   return false;
                         }
                         else {
                              return false;
                         }
                    },
               }),
               playground: {
                    settings: {
                         'editor.theme': 'light',
                         'request.credentials': 'include'
                    }
               },
               context: async (ctx : any) => {
                         return {
                              user: await this.getUser(ctx),
                              api: this.api
                         };
                    }
               };
     }

     public async getUser(ctx : any) : Promise<any> {
          ctx.callbackWaitsForEmptyEventLoop = false;
          
          if (!ctx?.headers?.cookie || ctx?.headers?.cookie?.length < 1) {
               return false;
          }
          else {
               // console.log(ctx.headers.cookie);
               var cookieHeader = ctx.headers.cookie;
               var cookies = cookie.parse(cookieHeader);
               console.log(process.env.COOKIE_JWT_SIGNING_SECRET);

               // console.log(event.multiValueHeaders.Cookie[0]);
               // console.log(cookies["SessionToken"]);
     
               var decoded_token = jwt.verify(cookies["SessionToken"], process.env.COOKIE_JWT_SIGNING_SECRET);
               // console.log("decoded token", decoded_token);

               decoded_token.roles = ["root"];
               return decoded_token;
          }
     }

};