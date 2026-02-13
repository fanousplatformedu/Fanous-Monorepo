import { Float, Int, GraphQLISODateTime } from "@nestjs/graphql";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType("ParentPortalRecommendation")
export class ParentPortalRecommendationEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) type!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => Int, { nullable: true }) rank?: number | null;
  @Field(() => String, { nullable: true }) targetJson?: string | null;
  @Field(() => String, { nullable: true }) targetMajorCode?: string | null;
  @Field(() => String, { nullable: true }) targetCareerCode?: string | null;
  @Field(() => String, { nullable: true }) explainabilityFactors?:
    | string
    | null;
  @Field(() => Float, { nullable: true }) confidence?: number | null;
}
