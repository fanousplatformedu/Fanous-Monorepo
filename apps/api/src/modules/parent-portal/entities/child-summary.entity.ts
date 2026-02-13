import { Int, GraphQLISODateTime } from "@nestjs/graphql";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class ChildSummaryEntity {
  @Field(() => ID) userId!: string;
  @Field(() => Int) learningHours!: number;
  @Field(() => Int) assessmentsCount!: number;
  @Field(() => Int) certificatesEarned!: number;
  @Field(() => String, { nullable: true }) lastScores?: string | null;
  @Field(() => String, { nullable: true }) lastResultSummary?: string | null;
  @Field(() => GraphQLISODateTime, { nullable: true })
  lastAssessmentAt?: Date | null;
}
