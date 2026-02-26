import { NotificationGqlObjectNames } from "@notif/enums/gql-names.enum";
import { NotificationChannel } from "@notif/enums/notif-channel.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(NotificationGqlObjectNames.NotificationResult)
export class NotificationResultEntity {
  @Field() message!: string;
  @Field() destination!: string;
  @Field({ nullable: true }) errorCode?: string;
  @Field({ nullable: true }) errorMessage?: string;
  @Field(() => String) channel!: NotificationChannel;
  @Field({ nullable: true }) providerMessageId?: string;
}
