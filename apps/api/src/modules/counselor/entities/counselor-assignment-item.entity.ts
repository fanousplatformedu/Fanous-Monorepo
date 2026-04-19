import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AssignmentStatus } from "@prisma/client";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_ASSIGNMENT_ITEM)
export class CounselorAssignmentItemEntity {
  @Field() title!: string;
  @Field() assignmentId!: string;
  @Field({ nullable: true }) dueAt!: Date;
  @Field(() => Int) reviewedCount!: number;
  @Field(() => Int) pendingReviews!: number;
  @Field({ nullable: true }) publishedAt!: Date;
  @Field(() => Int) totalAssignedStudents!: number;
  @Field(() => AssignmentStatus) status!: AssignmentStatus;
}
