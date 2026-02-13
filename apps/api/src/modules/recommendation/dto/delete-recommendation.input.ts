import { InputType, Field } from "@nestjs/graphql";

@InputType("DeleteRecommendationInput")
export class DeleteRecommendationInput {
  @Field(() => String) id!: string;
  @Field(() => String) tenantId!: string;
}
