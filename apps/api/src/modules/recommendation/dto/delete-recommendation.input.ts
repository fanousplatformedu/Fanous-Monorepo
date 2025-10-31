import { InputType, Field } from "@nestjs/graphql";

@InputType("DeleteRecommendationInput")
export class DeleteRecommendationInput {
  @Field() id: string;
  @Field() tenantId: string;
}
