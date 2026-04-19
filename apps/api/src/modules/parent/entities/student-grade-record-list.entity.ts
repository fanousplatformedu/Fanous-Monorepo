import { StudentGradeRecordEntity } from "@parent/entities/student-grade-record.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";

@ObjectType(ParentGqlObjectNames.StudentGradeRecordList)
export class StudentGradeRecordListEntity {
  @Field(() => Int) skip!: number;
  @Field(() => Int) take!: number;
  @Field(() => Int) total!: number;
  @Field(() => [StudentGradeRecordEntity]) items!: StudentGradeRecordEntity[];
}
