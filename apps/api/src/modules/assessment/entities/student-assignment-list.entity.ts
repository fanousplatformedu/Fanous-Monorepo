import { Field, Float, ObjectType } from "@nestjs/graphql";
import { AssessmentGqlObjectNames } from "@assessment/enums/gql-names.enum";
import { StudentAssignmentStatus } from "@prisma/client";
import { AssignmentRefEntity } from "@assessment/entities/assignment-ref.entity";
import { GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType(AssessmentGqlObjectNames.StudentAssignment)
export class StudentAssignmentEntity {
  @Field() id!: string;
  @Field() studentId!: string;
  @Field() assignmentId!: string;
  @Field(() => String) status!: StudentAssignmentStatus;
  @Field(() => GraphQLISODateTime, { nullable: true }) startedAt?: Date | null;
  @Field(() => GraphQLISODateTime, { nullable: true })
  submittedAt?: Date | null;
  @Field(() => GraphQLISODateTime, { nullable: true })
  evaluatedAt?: Date | null;
  @Field(() => Float) completionRate!: number;
  @Field(() => AssignmentRefEntity, { nullable: true })
  assignment?: AssignmentRefEntity | null;
}
