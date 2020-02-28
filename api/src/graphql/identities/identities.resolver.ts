var bcrypt = require('bcryptjs');

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

import { GremlinHelper } from '../../../gremlin'

@Resolver(of => identity)
export class IdentityResolver {

     @Query(() => identity)
     async I(): Promise<identity | undefined> {

          let gremlin = new GremlinHelper();
          
          var q2 = gremlin.g.V()
               .has('label','identity')
               .has('cid', '0')
               .has("email", "is_in_use@example.com");
               // .property('name_given', "John")
               // .property('name_family', "Doe");

          var docs = await gremlin.executeQuery(q2);
          
          if (docs.length == 1) {
               var doc = docs._items[0].properties;
               // console.log(doc);
               
               let i = new identity();
               i.email = gremlin.getPropertyValue(doc, "email") || "not found";
               i.name_given = gremlin.getPropertyValue(doc, "name_given");
               i.name_family = gremlin.getPropertyValue(doc, "name_family");

               await gremlin.close();
               return i;
          }
          await gremlin.close();
          return undefined;
     }

     @Mutation(() => identity)
     async identities_add(
          @Arg("data") { email }: identities_add
     ): Promise<identity> {
          return new identity();
     }

     @Mutation(() => String)
     async identity_property_set(          
          @Arg("property") property: string,
          @Arg("value") value: string
     ): Promise<String> {
          // console.log(property + ": " + value);

          let gremlin = new GremlinHelper();
          var q2 = gremlin.g.V()
               .has('label','identity')
               .has('cid', '0')
               .has("email", "is_in_use@example.com")
               .property(property, value);

          var result = await gremlin.executeQuery(q2);
          await gremlin.close();
          // console.log(result);

          return "done";
     }

     @Mutation(() => Boolean)
     async identity_password_set(          
          @Arg("password_current") password_current: string,
          @Arg("password_new") password_new: string
     ): Promise<Boolean> {
          let gremlin = new GremlinHelper();
          var q2 = gremlin.g.V()
               .has('label','identity')
               .has('cid', '0')
               .has("email", "is_in_use@example.com")
               .property("password_hash", bcrypt.hashSync(password_new, 10));

          var result = await gremlin.executeQuery(q2);
          await gremlin.close();
          // console.log(result);

          return true;
     }

     @Mutation(() => String)
     async identity_email_reset_code(
          @Arg("email") email: string,
          @Arg("center_id") center_id: number
     ): Promise<Boolean> {
          return true;
     }
}



// @FieldResolver()
// async name(@Root() parent: identity) {
//      return `${parent.name_given} ${parent.name_family}`;
// }