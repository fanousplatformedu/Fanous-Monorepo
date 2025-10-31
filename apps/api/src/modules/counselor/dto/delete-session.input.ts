import { InputType, Field } from "@nestjs/graphql";

@InputType("DeleteCounselingSessionInput")
export class DeleteCounselingSessionInput {
  @Field() id: string;
  @Field() tenantId: string;
}
