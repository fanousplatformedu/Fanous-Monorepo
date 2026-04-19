import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.StudentAssignmentQuestion)
export class StudentAssignmentQuestionEntity {
  @Field(() => String) id!: string;
  @Field(() => Int) order!: number;
  @Field(() => String) text!: string;
  @Field(() => Int) questionNumber!: number;
  @Field(() => Int, { nullable: true }) answerValue?: number | null;
}
