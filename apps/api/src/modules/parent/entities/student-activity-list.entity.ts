import { Field, Int, ObjectType } from "@nestjs/graphql";
import { StudentActivityEntity } from "@parent/entities/student-activity.entity";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";

@ObjectType(ParentGqlObjectNames.StudentActivityList)
export class StudentActivityListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [StudentActivityEntity]) items!: StudentActivityEntity[];
}
