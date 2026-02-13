import { InputType, Field } from "@nestjs/graphql";

@InputType("SendTemplateInput")
export class SendTemplateInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) templateId!: string;
  @Field({ nullable: true }) variables?: string;
  @Field({ nullable: true }) audienceJson?: string;
  @Field({ defaultValue: false }) queueOnly?: boolean;
  @Field(() => [String], { nullable: true }) userIds?: string[];
}
