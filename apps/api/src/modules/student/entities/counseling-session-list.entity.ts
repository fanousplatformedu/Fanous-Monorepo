import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { CounselingSessionEntity } from "@student/entities/counseling-session.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.CounselingSessionList)
export class CounselingSessionListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [CounselingSessionEntity]) items!: CounselingSessionEntity[];
}
