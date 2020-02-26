import { Center } from "./center";
import { InputType, Field } from "type-graphql";

@InputType()
export class CenterInput implements Partial<Center> {
  @Field()
  name: string;

  // @Field({ nullable: true })
  // description?: string;
}