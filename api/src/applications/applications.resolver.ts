var bcrypt = require('bcryptjs');

import {
     Resolver,
     Query,
     FieldResolver,
     Arg,
     Root,
     Mutation,
     Authorized
   } from "type-graphql";

import { plainToClass } from "class-transformer";
import { application } from "./application";

import { GremlinHelper } from '../gremlin';
let gremlin = new GremlinHelper();

@Resolver(of => application)
export class ApplicationsResolver {

     @Authorized()
     @Query(() => [application])
     async applications(): Promise<Array<application>> {
          console.log("....");
          var query = gremlin.g.V()
               .hasLabel("application")
               .valueMap(true);

          var docs = await gremlin.command(query);
          console.log(docs);

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
          
          console.log(items);
          // await gremlin.close();
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