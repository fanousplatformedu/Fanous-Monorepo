import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AssessmentResultEntity } from "@student/entities/assessment-result.entity";

@ObjectType(StudentDashboardGqlObjectNames.AssessmentStudentResultList)
export class AssessmentResultListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [AssessmentResultEntity]) items!: AssessmentResultEntity[];
}
