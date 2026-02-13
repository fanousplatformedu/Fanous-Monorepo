import { InputType, Field } from "@nestjs/graphql";

@InputType("SubmitAssessmentInput")
export class SubmitAssessmentInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) assessmentId!: string;
}
