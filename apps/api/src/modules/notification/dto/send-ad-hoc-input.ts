import { NotificationChannel } from "@prisma/client";
import { InputType, Field } from "@nestjs/graphql";

@InputType("SendAdHocNotificationInput")
export class SendAdHocNotificationInput {
  @Field(() => String) payload!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => [String]) userIds!: string[];
  @Field(() => String) channel!: NotificationChannel;
  @Field({ defaultValue: false }) queueOnly?: boolean;
}
