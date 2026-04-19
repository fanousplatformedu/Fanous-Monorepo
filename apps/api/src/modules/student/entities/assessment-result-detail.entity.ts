import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, Float, ObjectType } from "@nestjs/graphql";
import { CareerMatchEntity } from "@student/entities/career-match.entity";

@ObjectType(StudentDashboardGqlObjectNames.AssessmentResultDetail)
export class AssessmentResultDetailEntity {
  @Field(() => String) id!: string;
  @Field(() => Float) musical!: number;
  @Field(() => String) createdAt!: Date;
  @Field(() => Float) linguistic!: number;
  @Field(() => Float) logicalMath!: number;
  @Field(() => Float) naturalistic!: number;
  @Field(() => Float) visualSpatial!: number;
  @Field(() => Float) interpersonal!: number;
  @Field(() => Float) intrapersonal!: number;
  @Field(() => String) assignmentTitle!: string;
  @Field(() => Float) bodilyKinesthetic!: number;
  @Field(() => String) studentAssignmentId!: string;
  @Field(() => String) dominantIntelligence!: string;
  @Field(() => String, { nullable: true }) scoreSummary?: string | null;
  @Field(() => [CareerMatchEntity]) careerMatches!: CareerMatchEntity[];
}
