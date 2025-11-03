import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class ChildSummaryEntity {
  @Field(() => ID) userId: string;
  @Field(() => Int) learningHours: number;
  @Field(() => Int) assessmentsCount: number;
  @Field(() => Int) certificatesEarned: number;
  @Field({ nullable: true }) lastScores?: string | null;
  @Field({ nullable: true }) lastAssessmentAt?: Date | null;
  @Field({ nullable: true }) lastResultSummary?: string | null;
}
