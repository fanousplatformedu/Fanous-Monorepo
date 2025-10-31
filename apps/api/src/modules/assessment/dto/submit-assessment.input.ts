import { InputType, Field } from "@nestjs/graphql";

@InputType("SubmitAssessmentInput")
export class SubmitAssessmentInput {
  @Field() tenantId: string;
  @Field() assessmentId: string;
}
