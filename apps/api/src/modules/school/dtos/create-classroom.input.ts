import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";

@InputType(SchoolGqlInputNames.CreateClassroomInput)
export class CreateClassroomInput {
  @Field() @IsString() @IsNotEmpty() name!: string;
  @Field() @IsString() @IsNotEmpty() gradeId!: string;
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() code?: string;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() year?: number;
}
