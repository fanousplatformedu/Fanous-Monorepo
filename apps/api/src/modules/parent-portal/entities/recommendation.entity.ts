import { ObjectType, Field, ID, Float, Int } from "@nestjs/graphql";

@ObjectType()
export class RecommendationEntity {
  @Field() type: string;
  @Field() createdAt: Date;
  @Field(() => ID) id: string;
  @Field({ nullable: true }) targetJson?: string | null;
  @Field(() => Int, { nullable: true }) rank?: number | null;
  @Field({ nullable: true }) targetMajorCode?: string | null;
  @Field({ nullable: true }) targetCareerCode?: string | null;
  @Field({ nullable: true }) explainabilityFactors?: string | null;
  @Field(() => Float, { nullable: true }) confidence?: number | null;
}
