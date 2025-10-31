import { InputType, Field } from "@nestjs/graphql";

@InputType("RunScoringInput")
export class RunScoringInput {
  @Field() tenantId: string;
  @Field() assessmentId: string;
}
