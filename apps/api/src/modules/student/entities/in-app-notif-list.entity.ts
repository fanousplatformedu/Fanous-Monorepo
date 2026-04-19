import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { InAppNotificationEntity } from "@student/entities/in-app-notif.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.InAppNotificationList)
export class InAppNotificationListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [InAppNotificationEntity]) items!: InAppNotificationEntity[];
}
