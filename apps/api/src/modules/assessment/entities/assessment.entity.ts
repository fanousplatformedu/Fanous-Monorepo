import { ObjectType, Field, ID } from "@nestjs/graphql";
import { AssessmentState } from "@assessment/enums/assessment.enums";
import { LanguageCode } from "@assessment/enums/assessment.enums";

@ObjectType()
export class AssessmentEntity {
  @Field(() => ID) id: string;
  @Field(() => Date) startedAt: Date;
  @Field(() => String) userId: string;
  @Field(() => String) tenantId: string;
  @Field(() => LanguageCode) language: LanguageCode;
  @Field(() => AssessmentState) state: AssessmentState;
  @Field(() => Date, { nullable: true }) scoredAt?: Date | null;
  @Field(() => Date, { nullable: true }) submittedAt?: Date | null;
  @Field(() => String, { nullable: true }) versionId?: string | null;
  @Field(() => String, { nullable: true }) assignmentId?: string | null;
}
