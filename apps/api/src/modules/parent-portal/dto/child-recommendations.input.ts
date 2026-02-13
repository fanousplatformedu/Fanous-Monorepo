import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("ChildRecommendationsInput")
export class ChildRecommendationsInput {
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) type?: string;
  @Field(() => String) childUserId!: string;
  @Field(() => Int, { nullable: true }) limit?: number;
}
