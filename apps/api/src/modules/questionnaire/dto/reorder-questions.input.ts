import { InputType, Field } from "@nestjs/graphql";

@InputType("ReorderQuestionsInput")
export class ReorderQuestionsInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) itemsJson!: string;
  @Field(() => String) questionnaireId!: string;
}
