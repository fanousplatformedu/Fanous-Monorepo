import { InputType, Field } from "@nestjs/graphql";

@InputType("SaveResponseInput")
export class SaveResponseInput {
  @Field(() => String) value!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => String) questionId!: string;
  @Field(() => String) assessmentId!: string;
}
