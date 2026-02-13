import { NotificationChannel, NotificationStatus } from "@prisma/client";
import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("ListNotificationsInput")
export class ListNotificationsInput {
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) userId?: string;
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
  @Field(() => String, { nullable: true }) status?: NotificationStatus;
  @Field(() => String, { nullable: true }) channel?: NotificationChannel;
}
