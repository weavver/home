var bcrypt = require('bcryptjs');

import { filter_input } from '../common/filter';

import {
     Resolver,
     Root,
     Query,
     FieldResolver,
     Arg,
     Args,
     ArgOptions,
     ArgsType,
     Mutation,
     Authorized,
     UseMiddleware,
     Field,
     Int
   } from "type-graphql";

import { plainToClass, Type } from "class-transformer";
import { application, application_input, oauth2_uriparams } from "./application";

import { GremlinHelper } from '../gremlin';
import { Application } from 'express';

import { Ctx } from 'type-graphql';
import { Context } from '../home-apollo-server';

var ms = require('ms');
var jwt = require('jsonwebtoken');

@Resolver(of => application)
export class ApplicationsResolver {

     constructor() {}

     @Mutation(() => application)
     async application_getByClientId(@Ctx() ctx : Context,
                                     @Arg("client_id") client_id : string): Promise<application> {
          console.log("client_id", client_id);
          var query = ctx.api.gremlin.g.V()
               .hasLabel("application")
               .has("client_id", client_id)
               .limit(1)
               .valueMap(true);

          var docs = await ctx.api.gremlin.command(query);
          if (docs?.result.length > 0) {
               return this.getObject(ctx, docs.result[0])
          }
          else {
               throw Error("Application not found.");
          }
     }

     @Mutation(() => oauth2_uriparams)
     async application_giveConsent(@Ctx() ctx : Context,
                                   @Arg("client_id") client_id : string): Promise<oauth2_uriparams> {
          var code = jwt.sign({ "code": this.generatePassword(10),
                                "email": ctx.user?.email },
                              process.env.COOKIE_JWT_SIGNING_SECRET,
                              { expiresIn: ms('5m') });

          var params : oauth2_uriparams = {
               "code": code,
               "scope": "email profile openid"
               // "authuser": "0",
               // "hd": "default",
               // "prompt": "none"
          };

          return params;
     }

     @Query(() => [application])
     async applications(@Ctx() ctx : Context,
                        @Arg("filter_input") filter: filter_input): Promise<Array<application>> {
          // console.log("....", filter);

          var query;
          if (filter.id)
               query = ctx.api.gremlin.g.V(filter.id[0])
                    .valueMap(true);
          else
               query = ctx.api.gremlin.g.V()
                    .hasLabel("application")
                    .limit(filter.limit)
                    .valueMap(true);

          var docs = await ctx.api.gremlin.command(query);
          // console.log(docs);

          var items : Array<application> = [];
          docs.result.forEach((item : any) => {
               items.push(this.getObject(ctx, item));
          });

          // console.log(items);
          return items;
     }

     @Authorized("root")
     @Mutation(() => application)
     async applications_set(@Ctx() ctx : Context,
                            @Arg("application") { id, name, client_id, client_secret, host_email, host_url } : application_input): Promise<application> {
          console.log(id);
          if (!id) {
               let qAdd = ctx.api.gremlin.g.addV("application")
                    .property("name", name)
                    .property("client_id", this.generatePassword(20))
                    .property("client_secret", this.generatePassword(40))
                    .property("host_email", host_email)
                    .property("host_url", host_url)
                    .valueMap(true);
                    // .addE
               let rAdd = await ctx.api.gremlin.command(qAdd);
               // console.log("addv result", this.getObject(rAdd.result[0]));
               return this.getObject(ctx, rAdd.result[0]);
          } else {
               console.log('updating..');
               let qUpdate = ctx.api.gremlin.g.V(id)
                    .property("name", name)
                    .property("host_email", host_email)
                    .property("host_url", host_url)
                    // .property("client_id")
                    // .property("client_secret")
                    .valueMap(true);

               let rUpdate = await ctx.api.gremlin.command(qUpdate);
               // console.log("update result", this.getObject(rUpdate.result[0]));
               return this.getObject(ctx, rUpdate.result[0]);
          }
     }

     generatePassword(length : number) {
          var length = length,
              charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
              retVal = "";
          for (var i = 0, n = charset.length; i < length; ++i) {
              retVal += charset.charAt(Math.floor(Math.random() * n));
          }
          return retVal;
     }

     @Mutation(() => Boolean)
     async applications_delete(@Ctx() ctx : Context,
                               @Arg("application") { id } : application_input): Promise<Boolean> {
          let qApplicationDelete = ctx.api.gremlin.g.V(id).drop();
          await ctx.api.gremlin.command(qApplicationDelete);
          return true;
     }

     private getObject(ctx : Context, item : any, properties? : any) : application {
          let i = new application();
          i.id = parseInt(item.id);
          i.name = ctx.api.gremlin.getPropertyValue(item, "name", "");
          i.client_id = ctx.api.gremlin.getPropertyValue(item, "client_id", "");
          i.client_secret = ctx.api.gremlin.getPropertyValue(item, "client_secret", "");
          i.host_email = ctx.api.gremlin.getPropertyValue(item, "host_email", "");          
          i.host_name = ctx.api.gremlin.getPropertyValue(item, "host_name", "");
          i.host_url = ctx.api.gremlin.getPropertyValue(item, "host_url", "");
          return i;
     }
}