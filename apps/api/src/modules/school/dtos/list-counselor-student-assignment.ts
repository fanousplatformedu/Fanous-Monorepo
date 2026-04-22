import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { CounselorStudentLinkStatus } from "@prisma/client";
import { Field, InputType, Int } from "@nestjs/graphql";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";

@InputType(SchoolGqlInputNames.ListCounselorStudentAssignmentsInput)
export class ListCounselorStudentAssignmentsInput {
  @Field() @IsString() schoolId!: string;
  @Field(() => Int) @IsInt() @Min(0) take!: number;
  @Field(() => Int) @IsInt() @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() studentId?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() counselorId?: string;
  @Field(() => CounselorStudentLinkStatus, { nullable: true })
  @IsOptional()
  @IsEnum(CounselorStudentLinkStatus)
  status?: CounselorStudentLinkStatus;
}
