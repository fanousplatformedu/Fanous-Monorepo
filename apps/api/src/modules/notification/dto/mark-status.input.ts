import { NotificationStatus } from "@prisma/client";
import { InputType, Field } from "@nestjs/graphql";

@InputType("MarkNotificationStatusInput")
export class MarkNotificationStatusInput {
  @Field(() => String) id!: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) meta?: string;
  @Field(() => String) status!: NotificationStatus;
}
