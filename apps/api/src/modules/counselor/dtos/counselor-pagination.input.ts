import { IsInt, IsOptional, IsString } from "class-validator";
import { CounselorGqlInputNames } from "@counselor/enums/gql-names";
import { Field, InputType, Int } from "@nestjs/graphql";

@InputType(CounselorGqlInputNames.COUNSELOR_PAGINATION)
export class CounselorPaginationInput {
  @Field({ nullable: true }) @IsOptional() @IsString() search?: string;
  @Field(() => Int, { defaultValue: 1 }) @IsOptional() page?: number = 1;
  @Field(() => Int, { defaultValue: 10 })
  @IsOptional()
  @IsInt()
  limit?: number = 10;
}
