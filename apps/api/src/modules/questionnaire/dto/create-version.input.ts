import { InputType, Field, ID } from "@nestjs/graphql";

@InputType("CreateAssessmentVersionInput")
export class CreateAssessmentVersionInput {
  @Field(() => String) tenantId!: string;
  @Field(() => ID) questionnaireId!: string;
  @Field({ nullable: true }) changelog?: string;
  @Field({ nullable: true }) interpretationJson?: string;
}
