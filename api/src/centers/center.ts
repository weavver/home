import { MaxLength, Length, IsEmail } from "class-validator";

import {
     ObjectType,
     ID,
     Field,
     FieldResolver,
     Root,
     InputType
   } from "type-graphql";

@ObjectType("center", { description: "Object representing a center." })
export class center {
     @Field(() => Number, { nullable: true })
     id?: Number;

     @Field(() => String, { nullable: true })
     name?: string;

     @Field({ nullable: true, description: "Identities originate from a center." })
     description?: string;

     @Field(() => String, { nullable: true })
     smtp_server?: string;

     @Field(() => String, { nullable: true })
     smtp_port?: string;

     @Field(() => String, { nullable: true })
     smtp_user?: string;

     @Field()
     smtp_password?: string;

     @Field(() => String, { nullable: true })
     twilio_api_key?: string;
}

@InputType()
export class center_input implements Partial<center> {
     @Field(() => Number, { nullable: true })
     id?: Number;

     @Field(() => String, { nullable: true })
     name?: string;

     @Field(() => String, { nullable: true })
     smtp_server?: string;

     @Field(() => String, { nullable: true })
     smtp_port?: string;

     @Field(() => String, { nullable: true })
     smtp_user?: string;

     @Field(() => String, { nullable: true })
     smtp_password?: string;

     @Field(() => String, { nullable: true })
     twilio_api_key?: string;
}