import { IsEnum, IsOptional, IsString } from "class-validator";
import { CounselorPaginationInput } from "@counselor/dtos/counselor-pagination.input";
import { CounselorGqlInputNames } from "@counselor/enums/gql-names";
import { CounselorReviewStatus } from "@prisma/client";
import { Field, InputType } from "@nestjs/graphql";

@InputType(CounselorGqlInputNames.STUDENT_ASSESSMENT_QUEUE)
export class StudentAssessmentQueueInput extends CounselorPaginationInput {
  @Field({ nullable: true }) @IsOptional() @IsString() studentId?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() assignmentId?: string;
  @Field(() => CounselorReviewStatus, { nullable: true })
  @IsOptional()
  @IsEnum(CounselorReviewStatus)
  status?: CounselorReviewStatus;
}
