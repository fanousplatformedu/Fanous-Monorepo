import { CounselorReviewStatus, IntelligenceKey } from "@prisma/client";
import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_REVIEW_DETAIL)
export class CounselorReviewDetailEntity {
  @Field() id!: string;
  @Field() createdAt!: Date;
  @Field() studentId!: string;
  @Field() studentName!: string;
  @Field() assignmentId!: string;
  @Field() assignmentTitle!: string;
  @Field({ nullable: true }) feedback!: string;
  @Field({ nullable: true }) resultId!: string;
  @Field({ nullable: true }) reviewedAt!: Date;
  @Field(() => CounselorReviewStatus) status!: CounselorReviewStatus;
  @Field(() => IntelligenceKey, { nullable: true })
  dominantKey!: IntelligenceKey;
}
