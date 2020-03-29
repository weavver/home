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
let gremlin = new GremlinHelper();

@Resolver(of => application)
export class ApplicationsResolver {

     @Authorized()
     @Query(() => [application])
     async applications(@Args() { id, skip, limit }: Filter): Promise<Array<application>> {
          console.log("....", id);

          var query;
          if (id)
               query = gremlin.g.V(id[0])
                    .valueMap(true);
          else
               query = gremlin.g.V()
                    .hasLabel("application")
                    .limit(limit)
                    .valueMap(true);

          var docs = await gremlin.command(query);
          // console.log(docs);

          var items : Array<application> = [];
          if (docs.result.length > 0) {
               docs.result.forEach((vertex : any) => {
                    // console.log(vertex);
                    let item = new application();
                    item.id = vertex.id;
                    item.name = gremlin.getPropertyValue(item, "name", "[not set]");
                    items.push(item);
                    return item;  
               });
          }
          
          // console.log(items);
          return items;
     }

     @Authorized()
     @Mutation(() => String)
     async applications_add(
          @Arg("data") data: String
     ): Promise<String> {
          // let gremlin = new GremlinHelper();
          let query = gremlin.g.addV("application")
               .property('cid', '0')
               .property("name", "I Serve Law");
          gremlin.command(query);

          return data;
     }
}