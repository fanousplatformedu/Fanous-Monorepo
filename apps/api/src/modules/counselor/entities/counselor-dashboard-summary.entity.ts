import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_DASHBOARD_SUMMARY)
export class CounselorDashboardSummaryEntity {
  @Field(() => Int) sessionsToday!: number;
  @Field(() => Int) totalStudents!: number;
  @Field(() => Int) activeStudents!: number;
  @Field(() => Int) pendingReviews!: number;
  @Field(() => Int) upcomingSessions!: number;
  @Field(() => Int) unreadNotifications!: number;
}
