import {
     Resolver,
     Query,
     FieldResolver,
     Arg,
     Root,
     Mutation
   } from "type-graphql";

import { plainToClass } from "class-transformer";

@Resolver()
export class CenterResolver {
     @Query(() => String)
     async centers() {
          return "Hello";
     }
}
