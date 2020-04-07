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
import { application, application_input } from "./application";

import { GremlinHelper } from '../gremlin';
import { Application } from 'express';

@Resolver(of => application)
export class ApplicationsResolver {
     gremlin : GremlinHelper;

     constructor() {
          this.gremlin = new GremlinHelper();
     }
     
     @Authorized()
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
     
     @Authorized()
     @Mutation(() => Boolean)
     async applications_set(@Arg("application") { id, name, client_id, client_secret, host_email, host_url } : application_input): Promise<Boolean> {
          if (id) {
               let qUpdate = this.gremlin.g.V(id)
                    .property("name", name)
                    .property("client_id", client_id)
                    .property("client_secret", client_secret)
                    .property("host_email", host_email)
                    .property("host_url", host_url);
               await this.gremlin.command(qUpdate);
          } else {
               let qAdd = this.gremlin.g.addV("application")
                    .property("name", name)
                    .property("client_id", client_id)
                    .property("client_secret", client_secret)
                    .property("host_email", host_email)
                    .property("host_url", host_url);
                    // .addE
               await this.gremlin.command(qAdd);
          }
          return true;
     }

     private getObject(item : any) : application {
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

     @Mutation(() => Boolean)
     async applications_delete(@Arg("application") { id } : application_input): Promise<Boolean> {
          let qApplicationDelete = this.gremlin.g.V(id).drop();
          await this.gremlin.command(qApplicationDelete);
          return true;
     }
}