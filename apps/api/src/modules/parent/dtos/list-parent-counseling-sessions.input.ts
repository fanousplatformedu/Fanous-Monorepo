import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { CounselingSessionStatus } from "@prisma/client";
import { Field, InputType, Int } from "@nestjs/graphql";
import { ParentGqlInputNames } from "@parent/enums/gql-names.enum";

@InputType(ParentGqlInputNames.ListParentCounselingSessionsInput)
export class ListParentCounselingSessionsInput {
  @Field(() => Int) @IsInt() @Min(0) take!: number;
  @Field(() => Int) @IsInt() @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() childId!: string;
  @Field(() => CounselingSessionStatus, { nullable: true })
  @IsOptional()
  @IsEnum(CounselingSessionStatus)
  status!: CounselingSessionStatus;
}
