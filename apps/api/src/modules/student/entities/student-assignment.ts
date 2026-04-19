import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.StudentDashboardAssignment)
export class StudentAssignmentEntity {
  @Field(() => String) id!: string;
  @Field(() => String) title!: string;
  @Field(() => String) status!: string;
  @Field(() => String) assignmentId!: string;
  @Field(() => Float) completionRate!: number;
  @Field(() => String, { nullable: true }) dueAt?: Date | null;
  @Field(() => String, { nullable: true }) startedAt?: Date | null;
  @Field(() => String, { nullable: true }) submittedAt?: Date | null;
  @Field(() => String, { nullable: true }) evaluatedAt?: Date | null;
  @Field(() => String, { nullable: true }) publishedAt?: Date | null;
  @Field(() => String, { nullable: true }) targetMode?: string | null;
  @Field(() => String, { nullable: true }) description?: string | null;
}
