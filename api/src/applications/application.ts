import { MaxLength, Length, IsEmail } from "class-validator";

import { filter_input } from '../common/filter';

import {
     ObjectType,
     ID,
     Field,
     FieldResolver,
     Root,
     InputType,
     Int,
     Authorized
   } from "type-graphql";


@ObjectType("application")
// @ArgsType()
export class application {
     @Field(() => Number)
     id?: Number;

     @Field(() => String)
     name?: string;

     @Field(() => String, { nullable: true })
     client_id?: string;

     @Authorized("root")
     @Field(() => String, { nullable: true })
     client_secret?: string;

     @Field(() => String, { nullable: true })
     host_name?: string;

     @Field(() => String, { nullable: true })
     host_email?: string;

     @Field(() => String, { nullable: true })
     host_url?: string;

     @Field()
     name_initials(@Root() parent: application): String {
          if (this.name)
               return this.name.split(" ").map((n)=>n[0]).join(".");
          else
               return "[name not set]";
     }

     @Field(() => Date)
     added_at?: Date;
}

@InputType()
export class application_input implements Partial<application> {
     @Field(() => Number, { nullable: true })
     id?: Number;

     @Field(() => String, { nullable: true })
     name?: string;

     @Field(() => String, { nullable: true })
     client_id?: string;

     @Field(() => String, { nullable: true })
     client_secret?: string;

     @Field(() => String, { nullable: true })
     host_name?: string;

     @Field(() => String, { nullable: true })
     host_email?: string;
     
     @Field(() => String, { nullable: true })
     host_url?: string;
}

@ObjectType("oauth2_uriparams")
export class oauth2_uriparams {
     @Field(() => String)
     code?: String;

     @Field(() => String)
     scope?: string;

     @Field(() => String, { nullable: true })
     authuser?: string;

     @Field(() => String, { nullable: true })
     hd?: string;

     @Field(() => String, { nullable: true })
     prompt?: string;
};

@InputType()
export class application_filter_input implements Partial<filter_input> {
     @Field(type => [Int], { nullable: true })
     id?: Number[];

     @Field(() => String)
     client_id?: String;
}