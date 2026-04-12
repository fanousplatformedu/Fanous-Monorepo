import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { IsDateString } from "class-validator";

@InputType(SchoolGqlInputNames.EnrollStudentInput)
export class EnrollStudentInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field() @IsString() @IsNotEmpty() studentId!: string;
  @Field() @IsString() @IsNotEmpty() classroomId!: string;
  @Field({ nullable: true }) @IsOptional() @IsDateString() startedAt?: string;
}
