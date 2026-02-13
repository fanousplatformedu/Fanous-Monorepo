import { InputType, Field, Int } from "@nestjs/graphql";
import { RecommendationType } from "@recommendation/enums/recommendation.enums";

@InputType("GenerateRecommendationsInput")
export class GenerateRecommendationsInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) assessmentId!: string;
  @Field({ defaultValue: 0 }) minConfidence?: number;
  @Field({ defaultValue: true }) overwrite?: boolean;
  @Field(() => Int, { defaultValue: 10 }) topN?: number;
  @Field(() => [RecommendationType], {
    defaultValue: [RecommendationType.CAREER, RecommendationType.MAJOR],
  })
  types?: RecommendationType[];
}
