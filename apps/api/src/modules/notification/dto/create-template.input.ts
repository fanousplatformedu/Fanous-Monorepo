import { NotificationChannel, LanguageCode } from "@prisma/client";
import { InputType, Field } from "@nestjs/graphql";

@InputType("CreateNotificationTemplateInput")
export class CreateNotificationTemplateInput {
  @Field() code: string;
  @Field() tenantId: string;
  @Field(() => String) lang: LanguageCode;
  @Field({ nullable: true }) body?: string;
  @Field({ nullable: true }) subject?: string;
  @Field({ nullable: true }) bodyJson?: string;
  @Field(() => String) channel: NotificationChannel;
}

@InputType("UpdateNotificationTemplateInput")
export class UpdateNotificationTemplateInput {
  @Field() id: string;
  @Field() tenantId: string;
  @Field({ nullable: true }) body?: string;
  @Field({ nullable: true }) subject?: string;
  @Field({ nullable: true }) bodyJson?: string;
}
