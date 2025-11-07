import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("ConsentPageInput")
export class ConsentPageInput {
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
}
