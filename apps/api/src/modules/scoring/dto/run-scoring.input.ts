import { InputType, Field } from "@nestjs/graphql";

@InputType("RunScoringStrictInput")
export class RunScoringStrictInput {
  @Field() tenantId: string;
  @Field() assessmentId: string;
  @Field({ defaultValue: true }) overwrite?: boolean;
}
