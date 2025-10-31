import { InputType, Field } from "@nestjs/graphql";

@InputType("PreviewNotificationInput")
export class PreviewNotificationInput {
  @Field() tenantId: string;
  @Field() templateId: string;
  @Field({ nullable: true }) variables?: string;
}
