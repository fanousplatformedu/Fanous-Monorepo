import { ComputedMetricEntity } from "@scoring/entities/computed-metric.entity";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class ScoringPreviewEntity {
  @Field(() => String) tenantId!: string;
  @Field(() => String) scoresJson!: string;
  @Field(() => String) summaryJson!: string;
  @Field(() => String) assessmentId!: string;
  @Field(() => [ComputedMetricEntity]) metrics!: ComputedMetricEntity[];
}
