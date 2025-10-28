import { InputType, Field } from "@nestjs/graphql";

@InputType("ReorderQuestionsInput")
export class ReorderQuestionsInput {
  @Field() tenantId: string;
  @Field() itemsJson: string;
  @Field() questionnaireId: string;
}
