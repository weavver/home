import { MaxLength, Length, IsEmail } from "class-validator";

import {
     ObjectType,
     ID,
     Field,
     FieldResolver,
     Root,
     InputType
   } from "type-graphql";

@ObjectType({ description: "Object representing a center." })
export class center {
     @Field(() => Number)
     id: Number;

     @Field()
     name: string;

     @Field({ nullable: true, description: "Identities originate from a center." })
     description?: string;
}