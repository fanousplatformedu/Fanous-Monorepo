import { InputType, Field, Int } from "@nestjs/graphql";
import { RecommendationType } from "@recommendation/enums/recommendation.enums";

@InputType("ListRecommendationsInput")
export class ListRecommendationsInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) resultId?: string;
  @Field({ nullable: true }) assessmentId?: string;
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
  @Field(() => RecommendationType, { nullable: true })
  type?: RecommendationType;
}
