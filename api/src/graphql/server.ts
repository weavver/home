//import { ApolloServer, gql } from 'apollo-server-lambda';
import { ApolloServer, gql } from 'apollo-server-fastify';

import "reflect-metadata";
import * as path from "path";
import { Resolver, Query, buildSchema, buildSchemaSync } from "type-graphql"

import { CenterResolver } from "./centers/centers.resolver";
import { IdentityResolver } from "./identities/identities.resolver";
import { ApplicationsResolver } from "./applications/applications.resolver";
import { Callback } from 'aws-lambda';

var cookie = require('cookie');
var jwt = require('jsonwebtoken');

export class HomeApolloServer {
     server : ApolloServer;

     constructor() {
          this.server = new ApolloServer({
               schema: buildSchemaSync({
                    resolvers: [
                                   CenterResolver,
                                   IdentityResolver,
                                   ApplicationsResolver
                              ],
                    // emitSchemaFile: path.resolve(__dirname, "schema.gql"),
                    authChecker: ({ root, args, context, info }, roles) => {
                         // console.log(args);
                         // console.log(roles);
                         // console.log(info);
                         if (context.user)
                              return true;
                         else
                              return false;
                    },
                    
               }),
               playground: {
                    settings: {
                         'editor.theme': 'light',
                         'request.credentials': 'include'
                    }
               },
               context: async ({ event } : any) => ({
                         user: await this.getUser(event),
                    })
               },
          );
     }

     public async registerHandler(app : any) {
          app.register(this.server.createHandler({
                    cors: {
                         credentials: true,
                         origin: ['https://' + process.env.WEBSITE_DOMAIN]
                    }
               }));
     };

     public async getUser(event : any) : Promise<any> {
          if (!event || !event.multiValueHeaders || !event.multiValueHeaders.Cookie || event.multiValueHeaders.Cookie.length < 1)
               return null;

          // console.log(event.multiValueHeaders.Cookie[0]);
          // console.log(cookies["SessionToken"]);

          var cookieHeader = event.multiValueHeaders.Cookie[0];
          var cookies = cookie.parse(cookieHeader);
          var decoded_token = jwt.verify(cookies["SessionToken"], 'asdfasdfasdf');
          // console.log(decoded_token);
          return decoded_token;
     }
};