import { InputType, Field } from "@nestjs/graphql";

@InputType("SaveResponsesBulkInput")
export class SaveResponsesBulkInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) itemsJson!: string;
  @Field(() => String) assessmentId!: string;
  // [{"questionId":"...","value":{...}}, ...]
}
