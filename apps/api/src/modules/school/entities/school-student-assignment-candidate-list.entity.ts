import { SchoolStudentAssignmentCandidateEntity } from "@school/entities/school-student-assignment-candidate.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";

@ObjectType(SchoolGqlObjectNames.SchoolStudentAssignmentCandidateList)
export class SchoolStudentAssignmentCandidateListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [SchoolStudentAssignmentCandidateEntity])
  items!: SchoolStudentAssignmentCandidateEntity[];
}
