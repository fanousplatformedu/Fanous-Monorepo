import { AssessmentGqlObjectNames } from "@assessment/enums/gql-names.enum";
import { SchoolAssignmentEntity } from "@assessment/entities/school-assignment.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(AssessmentGqlObjectNames.SchoolAssignmentList)
export class SchoolAssignmentListEntity {
  @Field(() => Int) skip!: number;
  @Field(() => Int) take!: number;
  @Field(() => Int) total!: number;
  @Field(() => [SchoolAssignmentEntity]) items!: SchoolAssignmentEntity[];
}
