import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("ChildRecommendationsInput")
export class ChildRecommendationsInput {
  @Field() tenantId: string;
  @Field() childUserId: string;
  @Field({ nullable: true }) type?: string;
  @Field(() => Int, { nullable: true }) limit?: number;
}
