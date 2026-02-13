import { InputType, Field } from "@nestjs/graphql";

@InputType("DeleteCounselingSessionInput")
export class DeleteCounselingSessionInput {
  @Field(() => String) id!: string;
  @Field(() => String) tenantId!: string;
}
