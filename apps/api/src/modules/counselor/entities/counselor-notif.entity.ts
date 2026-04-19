import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { InAppNotificationType } from "@prisma/client";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_NOTIFICATION)
export class CounselorNotificationEntity {
  @Field() id!: string;
  @Field() body!: string;
  @Field() title!: string;
  @Field() isRead!: boolean;
  @Field() createdAt!: Date;
  @Field({ nullable: true }) readAt!: Date;
  @Field({ nullable: true }) actionUrl!: string;
  @Field(() => InAppNotificationType) type!: InAppNotificationType;
}
