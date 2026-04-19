import { StudentAssignmentQuestionEntity } from "@student/entities/student-assignment-question.entity";
import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.StudentAssignmentDetail)
export class StudentAssignmentDetailEntity {
  @Field(() => String) id!: string;
  @Field(() => String) title!: string;
  @Field(() => String) status!: string;
  @Field(() => String) assignmentId!: string;
  @Field(() => String, { nullable: true }) dueAt?: Date | null;
  @Field(() => String, { nullable: true }) publishedAt?: Date | null;
  @Field(() => String, { nullable: true }) description?: string | null;
  @Field(() => [StudentAssignmentQuestionEntity])
  questions!: StudentAssignmentQuestionEntity[];
}
