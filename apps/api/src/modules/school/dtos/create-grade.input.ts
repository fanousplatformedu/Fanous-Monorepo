import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SchoolGqlInputNames.CreateGradeInput)
export class CreateGradeInput {
  @Field() @IsString() @IsNotEmpty() name!: string;
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() code?: string;
}
