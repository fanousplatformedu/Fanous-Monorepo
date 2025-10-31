import { InputType, Field, Int } from "@nestjs/graphql";
import { RecommendationType } from "@recommendation/enums/recommendation.enums";

@InputType("PreviewRecommendationsInput")
export class PreviewRecommendationsInput {
  @Field() tenantId: string;
  @Field() assessmentId: string;
  @Field(() => [RecommendationType], {
    defaultValue: [RecommendationType.CAREER, RecommendationType.MAJOR],
  })
  types?: RecommendationType[];
  @Field(() => Int, { defaultValue: 10 }) topN?: number;
}
