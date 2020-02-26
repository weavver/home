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
     @Field(() => ID)
     id: number;

     @Field(() => String)
     email: string;

     @Field(() => String)
     @Length(1, 100)
     givenName: string;

     @Field(() => String)
     @Length(1, 100)
     lastName: string;

     @Field()
     @IsEmail()
     name: String

     @Field()
     name2(@Root() parent: identity): String {
          return "a b";
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