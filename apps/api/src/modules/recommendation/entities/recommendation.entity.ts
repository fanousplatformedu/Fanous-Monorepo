import { ID, Float, GraphQLISODateTime } from "@nestjs/graphql";
import { RecommendationType } from "@recommendation/enums/recommendation.enums";
import { ObjectType, Field } from "@nestjs/graphql";

import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class RecommendationEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => String) resultId!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => RecommendationType) type!: RecommendationType;
  @Field(() => Float, { nullable: true }) confidence?: number | null;
  @Field(() => String, { nullable: true }) targetMajorId?: string | null;
  @Field(() => String, { nullable: true }) targetCareerId?: string | null;
  @Field(() => GraphQLJSON, { nullable: true })
  explainabilityFactors?: Record<string, any> | null;
  @Field(() => GraphQLJSON, { nullable: true }) targetJson?: Record<
    string,
    any
  > | null;
}
