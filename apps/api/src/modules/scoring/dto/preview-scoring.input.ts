import { InputType, Field } from "@nestjs/graphql";

@InputType("PreviewScoringInput")
export class PreviewScoringInput {
  @Field() tenantId: string;
  @Field() assessmentId: string;
}
