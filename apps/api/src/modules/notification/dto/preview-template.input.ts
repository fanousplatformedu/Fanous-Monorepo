import { InputType, Field } from "@nestjs/graphql";

@InputType("PreviewNotificationInput")
export class PreviewNotificationInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) templateId!: string;
  @Field({ nullable: true }) variables?: string;
}
