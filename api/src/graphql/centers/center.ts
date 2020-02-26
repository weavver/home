import { Field, ObjectType, Int, Float } from "type-graphql";

@ObjectType({ description: "Object representing a center." })
export class Center {
  @Field()
  name: string;

  @Field({ nullable: true, description: "The recipe description with preparation info" })
  description?: string;

}
