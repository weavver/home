// import GraphQLJSON from "graphql-type-json";

import { MaxLength, Length, IsEmail } from "class-validator";

import {
     ObjectType,
     ID,
     Field,
     FieldResolver,
     Root,
     InputType,
     ArgsType
   } from "type-graphql";

@ObjectType("application")
// @ArgsType()
export class application {
     @Field(() => Number)
     id: Number;

     @Field(() => String)
     name: string;

     @Field(() => String, { nullable: true })
     client_id: string;

     @Field(() => String, { nullable: true })
     client_secret: string;

     @Field(() => String, { nullable: true })
     host_name: string;

     @Field(() => String, { nullable: true })
     host_email: string;

     @Field(() => String, { nullable: true })
     host_url: string;

     @Field()
     name_initials(@Root() parent: application): String {
          return this.name.split(" ").map((n)=>n[0]).join(".");
     }

     @Field(() => Date)
     added_at: Date;
}

@InputType()
export class application_input implements Partial<application> {
     @Field(() => Number, { nullable: true })
     id: Number;

     @Field(() => String, { nullable: true })
     name: string;

     @Field(() => String, { nullable: true })
     client_id: string;

     @Field(() => String, { nullable: true })
     client_secret: string;

     @Field(() => String, { nullable: true })
     host_name: string;

     @Field(() => String, { nullable: true })
     host_email: string;
     
     @Field(() => String, { nullable: true })
     host_url: string;
}