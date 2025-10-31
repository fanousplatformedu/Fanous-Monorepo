import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { RecommendationType } from "@recommendation/enums/recommendation.enums";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType()
export class RecommendationEntity {
  @Field(() => ID) id: string;
  @Field(() => Date) createdAt: Date;
  @Field(() => String) tenantId: string;
  @Field(() => String) resultId: string;
  @Field(() => GraphQLJSON, { nullable: true })
  targetJson?: Record<string, any> | null;
  @Field(() => String, { nullable: true })
  targetMajorId?: string | null;
  @Field(() => String, { nullable: true })
  targetCareerId?: string | null;
  @Field(() => RecommendationType)
  type: RecommendationType;
  @Field(() => GraphQLJSON, { nullable: true })
  explainabilityFactors?: any | null;
  @Field(() => Float, { nullable: true })
  confidence?: number | null;
}
