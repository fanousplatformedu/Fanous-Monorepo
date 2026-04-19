import { ParentProgressPointEntity } from "@parent/entities/parent-progress-point.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";

@ObjectType(ParentGqlObjectNames.ParentDashboardSummary)
export class ParentDashboardSummaryEntity {
  @Field(() => Int) totalResults!: number;
  @Field(() => Int) totalChildren!: number;
  @Field(() => Int) totalSessions!: number;
  @Field(() => Int) totalActivities!: number;
  @Field(() => [ParentProgressPointEntity])
  progressTimeline!: ParentProgressPointEntity[];
}
