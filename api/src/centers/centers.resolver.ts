import {
     Resolver,
     Query,
     FieldResolver,
     Arg,
     Root,
     Mutation
   } from "type-graphql";

import { plainToClass } from "class-transformer";
import { center } from "./center";


import { GremlinHelper } from '../gremlin'
import { Args,ArgsType, Field, Int } from 'type-graphql'
import { Min, Max } from "class-validator";

@Resolver()
export class CenterResolver {
     gremlin : GremlinHelper;

     constructor() {
          this.gremlin = new GremlinHelper();
     }

     @Query(() => [center], { nullable: true })
     async centers() : Promise<[center]> {
          var qCenters = this.gremlin.g.V()
               .hasLabel('center')
               .valueMap(true);

          var docs = await this.gremlin.command(qCenters);
          console.log(docs);

          var items : any = [];
          docs.result.forEach((item:any) => {
               items.push(this.getObject(item));
          });
          return items;
     }

     private getObject(item : any) : center {
          let i = new center();
          // console.log(item.id);
          // i.id = parseInt(item.id);
          i.name = this.gremlin.getPropertyValue(item, "name", "");
          return i;
     }
}
