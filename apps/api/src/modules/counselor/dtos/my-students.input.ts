import { CounselorStudentLinkStatus } from "@prisma/client";
import { CounselorPaginationInput } from "@counselor/dtos/counselor-pagination.input";
import { CounselorGqlInputNames } from "@counselor/enums/gql-names";
import { IsEnum, IsOptional } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType(CounselorGqlInputNames.MY_STUDENTS)
export class MyStudentsInput extends CounselorPaginationInput {
  @Field(() => CounselorStudentLinkStatus, { nullable: true })
  @IsOptional()
  @IsEnum(CounselorStudentLinkStatus)
  status?: CounselorStudentLinkStatus;
}
