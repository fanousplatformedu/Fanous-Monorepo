import { InputType, Field } from "@nestjs/graphql";

@InputType("RunExportJobInput")
export class RunExportJobInput {
  @Field(() => String) id!: string;
  @Field(() => String) tenantId!: string;
}
