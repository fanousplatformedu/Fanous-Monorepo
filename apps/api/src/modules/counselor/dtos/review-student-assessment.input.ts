import { IsEnum, IsOptional, IsString } from "class-validator";
import { CounselorGqlInputNames } from "@counselor/enums/gql-names";
import { CounselorReviewStatus } from "@prisma/client";
import { Field, InputType } from "@nestjs/graphql";

@InputType(CounselorGqlInputNames.REVIEW_STUDENT_ASSESSMENT)
export class ReviewStudentAssessmentInput {
  @Field() @IsString() reviewId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() feedback?: string;
  @Field(() => CounselorReviewStatus)
  @IsEnum(CounselorReviewStatus)
  status!: CounselorReviewStatus;
}
