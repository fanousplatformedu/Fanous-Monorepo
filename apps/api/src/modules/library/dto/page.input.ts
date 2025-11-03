import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("LibPageInput")
export class LibPageInput {
  @Field({ nullable: true }) q?: string;
  @Field({ nullable: true }) category?: string;
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
}
