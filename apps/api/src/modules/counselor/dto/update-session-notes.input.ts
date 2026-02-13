import { InputType, Field } from "@nestjs/graphql";

@InputType("UpdateCounselingSessionNotesInput")
export class UpdateCounselingSessionNotesInput {
  @Field(() => String) id!: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) notes?: string;
}
