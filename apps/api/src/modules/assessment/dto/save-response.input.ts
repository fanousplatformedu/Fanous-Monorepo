import { InputType, Field } from "@nestjs/graphql";

@InputType("SaveResponseInput")
export class SaveResponseInput {
  @Field() value: string;
  @Field() tenantId: string;
  @Field() questionId: string;
  @Field() assessmentId: string;
}
