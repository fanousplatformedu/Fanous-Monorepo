import { ObjectType, Field, ID, registerEnumType } from "@nestjs/graphql";
import { NotificationChannel, LanguageCode } from "@prisma/client";
import { GraphQLJSON } from "graphql-type-json";

registerEnumType(NotificationChannel, { name: "NotificationChannel" });
registerEnumType(LanguageCode, { name: "LanguageCode" });

@ObjectType()
export class NotificationTemplateEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) code!: string;
  @Field(() => Date) createdAt!: Date;
  @Field(() => String) tenantId!: string;
  @Field(() => LanguageCode) lang!: LanguageCode;
  @Field(() => String, { nullable: true }) body?: string | null;
  @Field(() => NotificationChannel) channel!: NotificationChannel;
  @Field(() => String, { nullable: true }) subject?: string | null;
  @Field(() => GraphQLJSON, { nullable: true }) bodyJson?: any | null;
}
