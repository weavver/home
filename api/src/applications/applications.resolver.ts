var bcrypt = require('bcryptjs');

import { Filter } from '../common/filter';

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
import { application } from "./application";

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
     async applications(@Args() { id, skip, limit }: Filter): Promise<Array<application>> {
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
     @Mutation(() => String)
     async applications_add(
          @Arg("data") data: String
     ): Promise<String> {
          // let gremlin = new GremlinHelper();
          let query = this.gremlin.g.addV("application")
               .property('cid', '0')
               .property("name", "Example Application");
          this.gremlin.command(query);

          return data;
     }

     private getObject(item : any) : application {
          let i = new application();
          i.id = parseInt(item.id);
          i.name = this.gremlin.getPropertyValue(item, "name", "");
          i.client_id = this.gremlin.getPropertyValue(item, "client_id", "");
          i.host_email = this.gremlin.getPropertyValue(item, "host_email", "");
          i.host_name = this.gremlin.getPropertyValue(item, "host_name", "");
          i.host_url = this.gremlin.getPropertyValue(item, "host_url", "");
          return i;
     }
}