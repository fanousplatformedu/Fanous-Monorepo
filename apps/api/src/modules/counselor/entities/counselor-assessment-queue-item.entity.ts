import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { CounselorReviewStatus } from "@prisma/client";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_ASSESSMENT_QUEUE_ITEM)
export class CounselorAssessmentQueueItemEntity {
  @Field() createdAt!: Date;
  @Field() reviewId!: string;
  @Field() studentId!: string;
  @Field() studentName!: string;
  @Field() assignmentId!: string;
  @Field() assignmentTitle!: string;
  @Field({ nullable: true }) reviewedAt!: Date;
  @Field({ nullable: true }) resultId!: string;
  @Field(() => CounselorReviewStatus) status!: CounselorReviewStatus;
}
