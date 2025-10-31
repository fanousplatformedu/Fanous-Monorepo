import { NotificationChannel, LanguageCode } from "@prisma/client";
import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("ListNotificationTemplatesInput")
export class ListNotificationTemplatesInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) code?: string;
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
  @Field(() => String, { nullable: true }) lang?: LanguageCode;
  @Field(() => String, { nullable: true }) channel?: NotificationChannel;
}
