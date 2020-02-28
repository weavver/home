const { ApolloServer, gql } = require('apollo-server-lambda');

import "reflect-metadata";
import * as path from "path";
import { Resolver, Query, buildSchema, buildSchemaSync } from "type-graphql"

import { CenterResolver } from "./centers/centers.resolver";
import { IdentityResolver } from "./identities/identities.resolver";
import { ApplicationsResolver } from "./applications/applications.resolver";

export const server = new ApolloServer({
          schema: buildSchemaSync({
               resolvers: [
                              CenterResolver,
                              IdentityResolver,
                              ApplicationsResolver
                         ],
               // emitSchemaFile: path.resolve(__dirname, "schema.gql"),
               authChecker: ({ context: {req} }) => {
                    console.log(req);
                    return true;
               }
          }),
          context: ({ req }: any) => ({ req })
     });

export const handler = server.createHandler({
          cors: {
               origin: '*',
               credentials: true,
          }
     });