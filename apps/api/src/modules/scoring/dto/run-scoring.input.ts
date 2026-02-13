import { InputType, Field } from "@nestjs/graphql";

@InputType("RunScoringStrictInput")
export class RunScoringStrictInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) assessmentId!: string;
  @Field({ defaultValue: true }) overwrite?: boolean;
}
