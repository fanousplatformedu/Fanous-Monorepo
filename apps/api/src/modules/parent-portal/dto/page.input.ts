import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("ParentPageInput")
export class ParentPageInput {
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
}
