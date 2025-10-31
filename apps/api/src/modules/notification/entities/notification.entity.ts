import { ObjectType, Field, ID, registerEnumType } from "@nestjs/graphql";
import { NotificationChannel, NotificationStatus } from "@prisma/client";
import { GraphQLISODateTime } from "@nestjs/graphql";

registerEnumType(NotificationChannel, { name: "NotificationChannel" });
registerEnumType(NotificationStatus, { name: "NotificationStatus" });

@ObjectType()
export class NotificationEntity {
  @Field(() => ID) id: string;
  @Field(() => String) tenantId: string;
  @Field(() => GraphQLISODateTime) createdAt: Date;
  @Field(() => NotificationStatus) status: NotificationStatus;
  @Field(() => String, { nullable: true }) meta?: string | null;
  @Field(() => NotificationChannel) channel: NotificationChannel;
  @Field(() => String, { nullable: true }) userId?: string | null;
  @Field(() => String, { nullable: true }) payload?: string | null;
  @Field(() => String, { nullable: true }) templateId?: string | null;
  @Field(() => GraphQLISODateTime, { nullable: true })
  sentAt?: Date | null;
}
