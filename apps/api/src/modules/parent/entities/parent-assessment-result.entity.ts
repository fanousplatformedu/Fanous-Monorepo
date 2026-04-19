import { Field, Float, ObjectType } from "@nestjs/graphql";
import { ParentCareerMatchEntity } from "@parent/entities/parent-career-match.entity";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { IntelligenceKey } from "@prisma/client";

@ObjectType(ParentGqlObjectNames.ParentAssessmentResult)
export class ParentAssessmentResultEntity {
  @Field() id!: string;
  @Field() assignmentTitle!: string;
  @Field(() => Float) musical!: number;
  @Field() studentAssignmentId!: string;
  @Field(() => Float) linguistic!: number;
  @Field(() => Float) logicalMath!: number;
  @Field(() => Float) naturalistic!: number;
  @Field(() => Float) visualSpatial!: number;
  @Field(() => Float) interpersonal!: number;
  @Field(() => Float) intrapersonal!: number;
  @Field(() => Float) bodilyKinesthetic!: number;
  @Field({ nullable: true }) summaryJson!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => IntelligenceKey, { nullable: true })
  dominantIntelligence!: IntelligenceKey;
  @Field(() => [ParentCareerMatchEntity], { nullable: true })
  careerMatches!: ParentCareerMatchEntity[];
}
