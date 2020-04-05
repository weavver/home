var bcrypt = require('bcryptjs');

import { filter_input } from '../common/filter';

import {
     Resolver,
     Root,
     Query,
     FieldResolver,
     Arg,
     Args,
     ArgsType,
     Mutation,
     Authorized,
     UseMiddleware,
     Field,
     Int
   } from "type-graphql";

import { plainToClass } from "class-transformer";
import { identity, identities_add } from "./identity";

import { GremlinHelper } from '../gremlin'
import { checkAccess } from '../checkAccess';

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
     async I(): Promise<identity> {
          var qIdentityGet = this.gremlin.g.V()
               .hasLabel('identity')
               .valueMap(true)
               .limit(1);

          var docs = await this.gremlin.command(qIdentityGet);
          console.log(docs);
          
          if (docs.result.length == 1) {
               var doc = docs.result[0];
               return this.getObject(doc);
          }
          throw new Error("an identity session is not available");
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
     ): Promise<Boolean> {
          const I = await this.I();          
          let gremlin = new GremlinHelper();
          var result = await gremlin.command(gremlin.g.V(I.id)
               .property(property, value));

          await gremlin.close();
          // console.log(result);

          return true;
     }

     @Mutation(() => Boolean)
     async identity_password_set(          
          @Arg("password_current") password_current: string,
          @Arg("password_new") password_new: string
     ): Promise<Boolean> {
          const I = await this.I();
          var q2 = this.gremlin.g.V(I.id)
                       .property("password_hash", bcrypt.hashSync(password_new, 10));

          var result = await this.gremlin.command(q2);
          // console.log(result);
          return true;
     }

     @Mutation(() => String)
     async identity_email_reset_code(
          @Arg("email") email: string,
          @Arg("center_id") center_id: number): Promise<Boolean> {
          return true;
     }

     @Authorized(["ADMIN"])
     // @UseMiddleware(checkAccess)
     @Query(() => [identity], { nullable: true })
     async identities(@Arg("filter_input") { id, skip, limit }: filter_input): Promise<[identity] | undefined> {
          var qIdentitiesGet;

          if (id) {
               // multiple ids not yet supported
               qIdentitiesGet = this.gremlin.g.V(id[0])
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
          var items : any = [];
          docs.result.forEach((item:any) => {
                    console.log(item.email);
                    items.push(this.getObject(item));
               });
          return items;
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