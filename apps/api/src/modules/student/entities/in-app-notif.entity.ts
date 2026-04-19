import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.InAppNotification)
export class InAppNotificationEntity {
  @Field(() => String) id!: string;
  @Field(() => String) type!: string;
  @Field(() => String) body!: string;
  @Field(() => String) title!: string;
  @Field(() => String) createdAt!: Date;
  @Field(() => Boolean) isRead!: boolean;
  @Field(() => String, { nullable: true }) readAt?: Date | null;
  @Field(() => String, { nullable: true }) actionUrl?: string | null;
}
