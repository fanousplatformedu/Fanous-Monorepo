import { NotificationChannel } from "@prisma/client";
import { InputType, Field } from "@nestjs/graphql";

@InputType("EnqueueNotificationByTemplateInput")
export class EnqueueNotificationByTemplateInput {
  @Field() tenantId: string;
  @Field() templateId: string;
  @Field({ nullable: true }) delayMs?: number;
  @Field({ nullable: true }) variables?: string;
  @Field({ nullable: true }) audienceJson?: string;
  @Field(() => [String], { nullable: true }) userIds?: string[];
}

@InputType("EnqueueNotificationAdHocInput")
export class EnqueueNotificationAdHocInput {
  @Field() payload: string;
  @Field() tenantId: string;
  @Field(() => [String]) userIds: string[];
  @Field({ nullable: true }) delayMs?: number;
  @Field(() => String) channel: NotificationChannel;
}
