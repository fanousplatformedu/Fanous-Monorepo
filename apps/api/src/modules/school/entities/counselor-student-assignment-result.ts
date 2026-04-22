import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";

@ObjectType(SchoolGqlObjectNames.CounselorStudentAssignmentResult)
export class CounselorStudentAssignmentResultEntity {
  @Field() message!: string;
  @Field() success!: boolean;
  @Field(() => Int) affectedCount!: number;
}
