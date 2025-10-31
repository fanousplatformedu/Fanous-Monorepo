import { InputType, Field } from "@nestjs/graphql";

@InputType("RunExportJobInput")
export class RunExportJobInput {
  @Field() id: string;
  @Field() tenantId: string;
}
