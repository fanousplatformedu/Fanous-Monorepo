import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { StudentAssignmentEntity } from "@student/entities/student-assignment";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.StudentAssignmentList)
export class StudentAssignmentListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [StudentAssignmentEntity]) items!: StudentAssignmentEntity[];
}
