import { CounselorPaginationInput } from "@counselor/dtos/counselor-pagination.input";
import { CounselorGqlInputNames } from "../enums/gql-names";
import { IsOptional, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType(CounselorGqlInputNames.COUNSELOR_ASSIGNMENTS)
export class CounselorAssignmentsInput extends CounselorPaginationInput {
  @Field({ nullable: true }) @IsOptional() @IsString() studentId?: string;
}
