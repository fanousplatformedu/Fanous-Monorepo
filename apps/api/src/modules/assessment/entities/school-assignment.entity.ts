import { AssignmentStatus, AssignmentTargetMode } from "@prisma/client";
import { AssessmentGqlObjectNames } from "@assessment/enums/gql-names.enum";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(AssessmentGqlObjectNames.SchoolAssignment)
export class SchoolAssignmentEntity {
  @Field() id!: string;
  @Field() title!: string;
  @Field() schoolId!: string;
  @Field() createdById!: string;
  @Field(() => String) status!: AssignmentStatus;
  @Field(() => GraphQLISODateTime) updatedAt!: Date;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => String) targetMode!: AssignmentTargetMode;
  @Field(() => String, { nullable: true }) description?: string | null;
  @Field(() => String, { nullable: true }) targetGradeId?: string | null;
  @Field(() => GraphQLISODateTime, { nullable: true }) dueAt?: Date | null;
  @Field(() => String, { nullable: true }) targetClassroomId?: string | null;
  @Field(() => GraphQLISODateTime, { nullable: true })
  publishedAt?: Date | null;
}
