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

import { checkAccess } from '../checkAccess';
import { API } from '../api';

import { Ctx } from 'type-graphql';
import { Context } from '../apollo-server';

@Resolver(of => identity)
export class IdentityResolver {
     constructor(api : API) {
     }

     @Mutation(() => String)
     async echo(@Arg("data") data: string): Promise<string> {
          return data;
     }

     // @UseMiddleware(checkAccess)
     @Query(() => identity)
     async I(@Ctx() ctx : Context): Promise<identity> {
          var qIdentityGet = ctx.api.gremlin.g.V()
               .hasLabel('identity')
               .valueMap(true)
               .limit(1);

          var docs = await ctx.api.gremlin.command(qIdentityGet);
          console.log(docs);

          if (docs.result.length == 1) {
               var doc = docs.result[0];
               return this.getObject(ctx, doc);
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
          @Ctx() ctx : Context,
          @Arg("property") property: string,
          @Arg("value") value: string
     ): Promise<Boolean> {
          var result = await ctx.api.gremlin.command(ctx.api.gremlin.g.V(ctx.user?.sub)
               .property(property, value));
          // console.log(result);

          return true;
     }

     @Mutation(() => Boolean)
     async identity_password_set(     
          @Ctx() ctx : Context,     
          @Arg("password_current") password_current: string,
          @Arg("password_new") password_new: string
     ): Promise<Boolean> {
          var q2 = ctx.api.gremlin.g.V(ctx.user?.sub)
                       .property("password_hash", bcrypt.hashSync(password_new, 10));

          var result = await ctx.api.gremlin.command(q2);
          // console.log(result);
          return true;
     }

     @Mutation(() => String)
     async identity_email_reset_code(
          @Arg("email") email: string,
          @Arg("center_id") center_id: number): Promise<Boolean> {
          return true;
     }

     @Authorized(["root"])
     // @UseMiddleware(checkAccess)
     @Query(() => [identity], { nullable: true })
     async identities(@Ctx() ctx : Context,
                      @Arg("filter_input") { id, skip, limit }: filter_input): Promise<[identity] | undefined> {
          var qIdentitiesGet;

          if (id) {
               // multiple ids not yet supported
               qIdentitiesGet = ctx.api.gremlin.g.V(id[0])
                    .hasLabel('identity')
                    .has('cid', 0)
                    // .property("id")
                    .valueMap(true);
          }
          else {
               qIdentitiesGet = ctx.api.gremlin.g.V()
                    .hasLabel('identity')
                    .has('cid', 0)
                    // .property("id")
                    .valueMap(true);
          }

          var docs = await ctx.api.gremlin.command(qIdentitiesGet);
          // return docs.result;
          var items : any = [];
          docs.result.forEach((item:any) => {
                    console.log(item.email);
                    items.push(this.getObject(ctx, item));
               });
          return items;
     }

     private getObject(ctx : Context, item : any) : identity {
          let i = new identity();
          // console.log(item.id);
          i.id = parseInt(item.id);
          i.email = item.email[0] || "not found";
          i.name_given = ctx.api.gremlin.getPropertyValue(item, "name_given", "");
          i.name_family = ctx.api.gremlin.getPropertyValue(item, "name_family", "");
          return i;
     }
}

// @FieldResolver()
// async name(@Root() parent: identity) {
//      return `${parent.name_given} ${parent.name_family}`;
// }