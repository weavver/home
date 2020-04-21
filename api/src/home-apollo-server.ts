import { ApolloServer as ApolloServerFastify, Config as ConfigFastify, gql } from 'apollo-server-fastify';
import { ApolloServer as ApolloServerLambda, Config as ConfigLambda } from 'apollo-server-lambda';

import "reflect-metadata";
import * as path from "path";
import { Resolver, Query, buildSchema, buildSchemaSync } from "type-graphql"

import { CenterResolver } from "./centers/centers.resolver";
import { IdentityResolver } from "./identities/identities.resolver";
import { ApplicationsResolver } from "./applications/applications.resolver";
import { Callback, Context } from 'aws-lambda';
import { GremlinHelper } from './gremlin';

var cookie = require('cookie');
var jwt = require('jsonwebtoken');

export class HomeApolloServer {

     constructor() {}

     public getFastifyServer(app : any) : ApolloServerFastify {
          var server = new ApolloServerFastify(this.getParameters() as ConfigFastify);

          console.log("initializing in process graphql service...");
          app.register(server.createHandler({
                    cors: {
                         credentials: true,
                         origin: ['https://' + process.env.WEBSITE_DOMAIN]
                    }
               }));

          return server;
     }

     public getLambdaServer() : ApolloServerLambda {
          return new ApolloServerLambda(this.getParameters() as ConfigLambda);
     }

     public getParameters() : any {
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
               context: async (ctx : any) => ({
                         user: await this.getUser(ctx),
                    })
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

// this is used by serverless.yml to help bypass compatibility issues between fastify
//     and apolloserver while using serverless-offline and aws api gateway
export const handler = new HomeApolloServer().getLambdaServer().createHandler({
     cors: {
          credentials: true,
          origin: ['https://' + process.env.WEBSITE_DOMAIN]
     }
});
