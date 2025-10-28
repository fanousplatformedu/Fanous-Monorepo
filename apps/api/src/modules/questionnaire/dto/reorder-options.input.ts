import { InputType, Field } from "@nestjs/graphql";

@InputType("ReorderOptionsInput")
export class ReorderOptionsInput {
  @Field() tenantId: string;
  @Field() itemsJson: string;
  @Field() questionId: string;
}
