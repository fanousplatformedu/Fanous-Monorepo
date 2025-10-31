import { InputType, Field } from "@nestjs/graphql";

@InputType("UpdateCounselingSessionNotesInput")
export class UpdateCounselingSessionNotesInput {
  @Field() id: string;
  @Field() tenantId: string;
  @Field({ nullable: true }) notes?: string;
}
