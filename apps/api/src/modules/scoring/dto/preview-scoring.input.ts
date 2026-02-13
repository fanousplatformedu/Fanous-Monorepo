import { InputType, Field } from "@nestjs/graphql";

@InputType("PreviewScoringInput")
export class PreviewScoringInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) assessmentId!: string;
}
