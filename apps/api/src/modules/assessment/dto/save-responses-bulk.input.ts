import { InputType, Field } from "@nestjs/graphql";

@InputType("SaveResponsesBulkInput")
export class SaveResponsesBulkInput {
  @Field() tenantId: string;
  @Field() itemsJson: string;
  @Field() assessmentId: string;
  // [{"questionId":"...","value":{...}}, ...]
}
