import {
     ArgsType,
     Field,
     Int,
     InputType
   } from "type-graphql";

import { Min, Max } from "class-validator";

@ArgsType()
export class filter {
     @Field(type => [Int], { nullable: true })
     id?: Number[];

     @Field(type => Int, { defaultValue: 0 })
     @Min(0)
     skip: number = 0;

     @Field(type => Int)
     @Min(1)
     @Max(50)
     limit = 25;

     // helpers - index calculations
     get startIndex(): number {
          return this.skip;
     }
     get endIndex(): number {
          return this.skip + this.limit;
     }
}

@InputType()
export class filter_input implements Partial<filter> {
     @Field(type => [Int], { nullable: true })
     id?: Number[];

     @Field(type => Int, { defaultValue: 0 })
     @Min(0)
     skip?: number = 0;

     @Field(type => Int)
     @Min(1)
     @Max(50)
     limit? = 25;
}