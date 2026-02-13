import { ParentNotificationEntity } from "@parent-portal/entities/notification.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class NotificationPageEntity {
  @Field(() => Int) page!: number;
  @Field(() => Int) total!: number;
  @Field(() => Int) pageSize!: number;
  @Field(() => [ParentNotificationEntity]) items!: ParentNotificationEntity[];
}
