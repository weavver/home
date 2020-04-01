// import GraphQLJSON from "graphql-type-json";

import { MaxLength, Length, IsEmail } from "class-validator";

import {
     ObjectType,
     ID,
     Field,
     FieldResolver,
     Root,
     InputType
   } from "type-graphql";

@ObjectType("identity")
export class identity {
     @Field(() => Number)
     id: Number;

     @Field(() => String)
     email: string;

     @Field(() => String, { nullable: true })
     @Length(1, 100)
     name_given: string | undefined;

     @Field(() => String, { nullable: true })
     @Length(1, 100)
     name_family: string | undefined;

     @Field()
     name(@Root() parent: identity): String {
          return `${parent.name_given} ${parent.name_family}`;
     }

     password_hash: string;

     reset_code: string;

     @Field(() => Date)
     added_at: Date;
}

@InputType()
export class identities_add{
     @Field()
     email: string;
}