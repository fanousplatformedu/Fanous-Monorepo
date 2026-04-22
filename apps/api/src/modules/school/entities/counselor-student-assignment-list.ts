import { CounselorStudentAssignmentEntity } from "@school/entities/counselor-student-assignment.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";

@ObjectType(SchoolGqlObjectNames.CounselorStudentAssignmentList)
export class CounselorStudentAssignmentListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [CounselorStudentAssignmentEntity])
  items!: CounselorStudentAssignmentEntity[];
}
