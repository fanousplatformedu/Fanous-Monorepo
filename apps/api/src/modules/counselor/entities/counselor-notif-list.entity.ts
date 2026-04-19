import { CounselorNotificationEntity } from "@counselor/entities/counselor-notif.entity";
import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_NOTIFICATION_LIST)
export class CounselorNotificationListEntity {
  @Field() hasNext!: boolean;
  @Field(() => Int) page!: number;
  @Field(() => Int) limit!: number;
  @Field(() => Int) total!: number;
  @Field(() => [CounselorNotificationEntity])
  items!: CounselorNotificationEntity[];
}
