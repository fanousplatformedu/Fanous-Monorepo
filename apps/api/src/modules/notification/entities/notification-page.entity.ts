import { NotificationTemplateEntity } from "./notification-template.entity";
import { ObjectType, Field, Int } from "@nestjs/graphql";
import { NotificationEntity } from "./notification.entity";

@ObjectType()
export class NotificationPageEntity {
  @Field(() => Int) page: number;
  @Field(() => Int) total: number;
  @Field(() => Int) pageSize: number;
  @Field(() => [NotificationEntity]) items: NotificationEntity[];
}

@ObjectType()
export class TemplatePageEntity {
  @Field(() => [NotificationTemplateEntity])
  items: NotificationTemplateEntity[];
  @Field(() => Int) total: number;
  @Field(() => Int) page: number;
  @Field(() => Int) pageSize: number;
}
