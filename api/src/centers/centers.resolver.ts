import {
     Resolver,
     Query,
     FieldResolver,
     Arg,
     Root,
     Authorized,
     Mutation
   } from "type-graphql";

import { filter_input } from '../common/filter';

import { plainToClass } from "class-transformer";
import { center, center_input } from "./center";


import { GremlinHelper } from '../gremlin'
import { Args,ArgsType, Field, Int } from 'type-graphql'
import { Min, Max, IsEmpty } from "class-validator";

@Resolver()
export class CenterResolver {
     gremlin : GremlinHelper;

     constructor() {
          this.gremlin = new GremlinHelper();
     }

     @Query(() => [center], { nullable: true })
     async centers(@Arg("filter_input") { id, skip, limit }: filter_input) : Promise<[center]> {
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

     @Authorized()
     @Mutation(() => center)
     async centers_set(@Arg("center") center : center_input): Promise<center> {
          console.log(center.id);
          if (!center.id) {
               let qAdd = this.gremlin.g.addV("center")
                    .property("name", center.name)
                    .property("smtp_server", center.smtp_server)
                    .property("smtp_port", center.smtp_port)
                    .property("smtp_user", center.smtp_user)
                    // .property("smtp_password", center.smtp_password)
                    .property("twilio_api_key", center.twilio_api_key)
                    .valueMap(true);
                    // .addE
               let rAdd = await this.gremlin.command(qAdd);
               // console.log("addv result", this.getObject(rAdd.result[0]));
               return this.getObject(rAdd.result[0]);
          } else {
               console.log('updating..');
               let qUpdate = this.gremlin.g.V(center.id)
                    .property("name", center.name)
                    .property("smtp_server", center.smtp_server)
                    .property("smtp_port", center.smtp_port)
                    .property("smtp_user", center.smtp_user)
                    .property("smtp_password", center.smtp_password)
                    .property("twilio_api_key", center.twilio_api_key);

               if (!this.isStringEmpty(center.smtp_password))
                    qUpdate = qUpdate.property("smtp_password", center.smtp_password);

               qUpdate = qUpdate.valueMap(true);

               let rUpdate = await this.gremlin.command(qUpdate);
               // console.log("update result", this.getObject(rUpdate.result[0]));
               return this.getObject(rUpdate.result[0]);
          }
     }

     isStringEmpty(str? : string) {
          return (!str || 0 === str.length);
      }

     private getObject(item : any) : center {
          let i = new center();
          // console.log(item.id);
          i.id = parseInt(item.id);
          i.name = this.gremlin.getPropertyValue(item, "name", "");
          i.smtp_server = this.gremlin.getPropertyValue(item, "smtp_server", "");
          i.smtp_port = this.gremlin.getPropertyValue(item, "smtp_port", "");
          i.smtp_port = this.gremlin.getPropertyValue(item, "smtp_user", "");
          i.smtp_password = "";
          // i.smtp_password = this.gremlin.getPropertyValue(item, "smtp_password", ""); // don't return to browser because of security reasons
          i.twilio_api_key = this.gremlin.getPropertyValue(item, "twilio_api_key", "");
          return i;
     }

     @Mutation(() => Boolean)
     async centers_delete(@Arg("center") { id } : center_input): Promise<Boolean> {
          let qCenterDelete = this.gremlin.g.V(id).drop();
          await this.gremlin.command(qCenterDelete);
          return true;
     }
}
