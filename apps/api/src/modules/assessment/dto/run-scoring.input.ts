import { InputType, Field } from "@nestjs/graphql";

@InputType("RunScoringInput")
export class RunScoringInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) assessmentId!: string;
}
