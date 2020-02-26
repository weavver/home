  
import {
     Resolver,
     Query,
     FieldResolver,
     Arg,
     Root,
     Mutation
   } from "type-graphql";

import { plainToClass } from "class-transformer";
import { identity, identities_add } from "./identity";

@Resolver(of => identity)
export class IdentityResolver {

     @Query(() => identity, { nullable: true })
     async i(): Promise<identity | undefined> {
          var ia = new identity();
          ia.email = "test@asdf.com";
          ia.givenName = "John";
          return ia;
          // return undefined;
     }

     @Mutation(() => identity)
     async identities_add(
          @Arg("data") { email }: identities_add
     ): Promise<identity> {
          return new identity();
     }

     @FieldResolver()
     async name(@Root() parent: identity) {
          return `${parent.givenName} ${parent.lastName}`;
     }

     @Mutation(() => String)
     async identities_email_reset_code(
          @Arg("email") email: string,
          @Arg("center_id") center_id: number
     ): Promise<Boolean> {
          return true;
     }
}
