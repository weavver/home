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

export interface Context {
  user?: {
       sub : number,
       email : string,
       iat : number,
       exp : number,
       roles : string[]
  };
}

var ms = require('ms');
var jwt = require('jsonwebtoken');

@Resolver(of => application)
export class ApplicationsResolver {
     gremlin : GremlinHelper;

     constructor() {
          this.gremlin = new GremlinHelper();
     }

     @Mutation(() => application)
     async application_getByClientId(@Arg("client_id") client_id : string): Promise<application> {
          console.log("client_id", client_id);
          var query = this.gremlin.g.V()
               .hasLabel("application")
               .has("client_id", client_id)
               .limit(1)
               .valueMap(true);

          var docs = await this.gremlin.command(query);
          if (docs?.result.length > 0) {
               return this.getObject(docs.result[0])
          }
          else {
               throw Error("Application not found.");
          }
     }

     @Mutation(() => oauth2_uriparams)
     async application_giveConsent(@Arg("client_id") client_id : string, @Ctx() ctx : Context): Promise<oauth2_uriparams> {
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
     async applications(@Arg("filter_input") { id, skip, limit }: filter_input): Promise<Array<application>> {
          console.log("....", id);

          var query;
          if (id)
               query = this.gremlin.g.V(id[0])
                    .valueMap(true);
          else
               query = this.gremlin.g.V()
                    .hasLabel("application")
                    .limit(limit)
                    .valueMap(true);

          var docs = await this.gremlin.command(query);
          // console.log(docs);

          var items : Array<application> = [];
          docs.result.forEach((item : any) => {
               items.push(this.getObject(item));
          });

          // console.log(items);
          return items;
     }

     @Authorized("root")
     @Mutation(() => application)
     async applications_set(@Arg("application") { id, name, client_id, client_secret, host_email, host_url } : application_input): Promise<application> {
          console.log(id);
          if (!id) {
               let qAdd = this.gremlin.g.addV("application")
                    .property("name", name)
                    .property("client_id", this.generatePassword(20))
                    .property("client_secret", this.generatePassword(40))
                    .property("host_email", host_email)
                    .property("host_url", host_url)
                    .valueMap(true);
                    // .addE
               let rAdd = await this.gremlin.command(qAdd);
               // console.log("addv result", this.getObject(rAdd.result[0]));
               return this.getObject(rAdd.result[0]);
          } else {
               console.log('updating..');
               let qUpdate = this.gremlin.g.V(id)
                    .property("name", name)
                    .property("host_email", host_email)
                    .property("host_url", host_url)
                    // .property("client_id")
                    // .property("client_secret")
                    .valueMap(true);

               let rUpdate = await this.gremlin.command(qUpdate);
               // console.log("update result", this.getObject(rUpdate.result[0]));
               return this.getObject(rUpdate.result[0]);
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
     async applications_delete(@Arg("application") { id } : application_input): Promise<Boolean> {
          let qApplicationDelete = this.gremlin.g.V(id).drop();
          await this.gremlin.command(qApplicationDelete);
          return true;
     }

     private getObject(item : any, properties? : any) : application {
          let i = new application();
          i.id = parseInt(item.id);
          i.name = this.gremlin.getPropertyValue(item, "name", "");
          i.client_id = this.gremlin.getPropertyValue(item, "client_id", "");
          i.client_secret = this.gremlin.getPropertyValue(item, "client_secret", "");
          i.host_email = this.gremlin.getPropertyValue(item, "host_email", "");          
          i.host_name = this.gremlin.getPropertyValue(item, "host_name", "");
          i.host_url = this.gremlin.getPropertyValue(item, "host_url", "");
          return i;
     }
}