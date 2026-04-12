import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";

@InputType(SchoolGqlInputNames.UpdateClassroomInput)
export class UpdateClassroomInput {
  @Field() @IsString() @IsNotEmpty() id!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() name?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() code?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() gradeId?: string;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() year?: number;
}
