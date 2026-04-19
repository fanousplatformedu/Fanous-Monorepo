import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { StudentProgressPointEntity } from "@student/entities/student-progress-point.entity";

@ObjectType(StudentDashboardGqlObjectNames.StudentDashboardSummary)
export class StudentDashboardSummaryEntity {
  @Field(() => Int) totalAssignments!: number;
  @Field(() => Int) pendingAssignments!: number;
  @Field(() => Int) unreadNotifications!: number;
  @Field(() => Int) submittedAssignments!: number;
  @Field(() => Int) evaluatedAssignments!: number;
  @Field(() => Float) latestOverallScore!: number;
  @Field(() => Int) inProgressAssignments!: number;
  @Field(() => Int) pendingCounselingSessions!: number;
  @Field(() => String, { nullable: true }) dominantIntelligence?: string | null;
  @Field(() => [StudentProgressPointEntity])
  progressTimeline!: StudentProgressPointEntity[];
}
