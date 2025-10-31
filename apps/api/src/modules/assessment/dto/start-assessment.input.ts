import { InputType, Field } from "@nestjs/graphql";
import { LanguageCode } from "@assessment/enums/assessment.enums";

@InputType("StartAssessmentInput")
export class StartAssessmentInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) versionId?: string;
  @Field({ nullable: true }) assignmentId?: string;
  @Field(() => LanguageCode, { defaultValue: LanguageCode.FA })
  language?: LanguageCode;
}
