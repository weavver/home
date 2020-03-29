import {
     ArgsType,
     Field,
     Int
   } from "type-graphql";

import { Min, Max } from "class-validator";

@ArgsType()
export class Filter {
     @Field(type => Int, { defaultValue: 0 })
     @Min(0)
     skip: number = 0;

     @Field(type => Int)
     @Min(1)
     @Max(50)
     limit = 25;

     @Field(type => [Int], { nullable: true })
     id?: Number[];

     // helpers - index calculations
     get startIndex(): number {
          return this.skip;
     }
     get endIndex(): number {
          return this.skip + this.limit;
     }
}