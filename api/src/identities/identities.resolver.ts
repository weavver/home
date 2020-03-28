var bcrypt = require('bcryptjs');

import {
     Resolver,
     Query,
     FieldResolver,
     Arg,
     Root,
     Mutation,
     Authorized,
     UseMiddleware
   } from "type-graphql";

import { plainToClass } from "class-transformer";
import { identity, identities_add } from "./identity";

import { GremlinHelper } from '../gremlin'
import { checkAccess } from '../checkAccess';

import { Args,ArgsType, Field, Int } from 'type-graphql'
import { Min, Max } from "class-validator";

@ArgsType()
export class IdentitiesArgs {
     @Field(type => Int, { defaultValue: 0 })
     @Min(0)
     skip: number;

     @Field(type => Int)
     @Min(1)
     @Max(50)
     take = 25;

     @Field(type => Int, { nullable: true })
     id?: string;

     // helpers - index calculations
     get startIndex(): number {
          return this.skip;
     }
     get endIndex(): number {
          return this.skip + this.take;
     }
}

@Resolver(of => identity)
export class IdentityResolver {
     gremlin : GremlinHelper;

     constructor() {
          this.gremlin = new GremlinHelper();
     }

     @Mutation(() => String)
     async echo(@Arg("data") data: string): Promise<string> {
          return data;
     }

     @Authorized(["ADMIN"])
     // @UseMiddleware(checkAccess)
     @Query(() => identity)
     async I(): Promise<identity | undefined> {
          var qIdentityGet = this.gremlin.g.V()
               .hasLabel('identity')
               .has('cid', 0)
               .has("email", "is_in_use@example.com")
               .valueMap(true)
               .limit(1);
               // .property('name_given', "John")
               // .property('name_family', "Doe");

          var docs = await this.gremlin.command(qIdentityGet);
          console.log(docs);
          
          if (docs.result.length == 1) {
               var doc = docs.result[0];
               console.log(doc.email);
               let i = new identity();
               i.id = doc.id[0];
               i.email = doc.email[0] || "not found";
               i.name_given = this.gremlin.getPropertyValue(doc, "name_given", "[not set]");
               i.name_family = this.gremlin.getPropertyValue(doc, "name_family", "[not set]");

               console.log(i);
               // await gremlin.close();
               return i;
          }
          // await gremlin.close();
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
          console.log(property + ": " + value);

          let gremlin = new GremlinHelper();
          var q2 = gremlin.g.V()
               .has('label','identity')
               .has('cid', '0')
               .has("email", "is_in_use@example.com")
               .property(property, value);

          var result = await gremlin.command(q2);
          await gremlin.close();
          // console.log(result);

          return "done";
     }

     @Mutation(() => Boolean)
     async identity_password_set(          
          @Arg("password_current") password_current: string,
          @Arg("password_new") password_new: string
     ): Promise<Boolean> {
          var q2 = this.gremlin.g.V()
               .has('label','identity')
               .has('cid', '0')
               .has("email", "is_in_use@example.com")
               .property("password_hash", bcrypt.hashSync(password_new, 10));

          var result = await this.gremlin.command(q2);
          // await gremlin.close();
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

     @Authorized(["ADMIN"])
     // @UseMiddleware(checkAccess)
     @Query(() => [identity], { nullable: true })
     async identities(@Args() { id, startIndex, endIndex }: IdentitiesArgs): Promise<[identity] | undefined> {
          var qIdentitiesGet;
          if (id) {
               qIdentitiesGet = this.gremlin.g.V(id)
                    .hasLabel('identity')
                    .has('cid', 0)
                    // .property("id")
                    .valueMap(true);
          }
          else {
               qIdentitiesGet = this.gremlin.g.V()
                    .hasLabel('identity')
                    .has('cid', 0)
                    // .property("id")
                    .valueMap(true);
          }

          var docs = await this.gremlin.command(qIdentitiesGet);
          // return docs.result;
          var identities : any = [];
          docs.result.forEach((item:any) => {
                    console.log(item.email);
                    identities.push(this.getObject(item));
               });
          return identities;
     }

     private getObject(item : any) : identity {
          let i = new identity();
          // console.log(item.id);
          i.id = parseInt(item.id);
          i.email = item.email[0] || "not found";
          i.name_given = this.gremlin.getPropertyValue(item, "name_given", "");
          i.name_family = this.gremlin.getPropertyValue(item, "name_family", "");
          return i;
     }
}


// @FieldResolver()
// async name(@Root() parent: identity) {
//      return `${parent.name_given} ${parent.name_family}`;
// }