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
import { application } from "./application";

import { GremlinHelper } from '../../../gremlin'

@Resolver(of => application)
export class ApplicationsResolver {

     @Query(() => [application])
     async applications(): Promise<Array<application>> {
          let gremlin = new GremlinHelper();

          var query = gremlin.g.V()
               .has('cid', '0')
               .has('label','application');

          var docs = await gremlin.executeQuery(query);

          var items : Array<application> = [];
          if (docs.length > 0) {
               (docs as any)._items.forEach( (vertex: any) => {
                    var properties = vertex.properties;
                    let item = new application();
                    item.id = vertex.id;
                    item.cid = gremlin.getPropertyValue(properties, "cid") as Number;
                    item.name = gremlin.getPropertyValue(properties, "name") || "not found";
                    items.push(item);
                    return item;  
               });
          }

          await gremlin.close();
          return items;
     }

     @Mutation(() => String)
     async applications_add(
          @Arg("data") data: String
     ): Promise<String> {
          let gremlin = new GremlinHelper();
          let query = gremlin.g.addV("application")
               .property('cid', '0')
               .property("name", "I Serve Law");
          gremlin.executeQuery(query);

          return data;
     }
}