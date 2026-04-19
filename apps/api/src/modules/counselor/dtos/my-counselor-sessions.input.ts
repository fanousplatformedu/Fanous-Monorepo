import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { CounselorPaginationInput } from "@counselor/dtos/counselor-pagination.input";
import { CounselingSessionStatus } from "@prisma/client";
import { CounselorGqlInputNames } from "@counselor/enums/gql-names";
import { Field, InputType } from "@nestjs/graphql";

@InputType(CounselorGqlInputNames.MY_COUNSELOR_SESSIONS)
export class MyCounselorSessionsInput extends CounselorPaginationInput {
  @Field(() => CounselingSessionStatus, { nullable: true })
  @IsOptional()
  @IsEnum(CounselingSessionStatus)
  status?: CounselingSessionStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  studentId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  from?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  to?: string;
}
