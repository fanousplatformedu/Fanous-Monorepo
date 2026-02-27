import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SchoolGqlInputNames.CreateSchoolAdminInput)
export class CreateSchoolAdminInput {
  @Field() @IsEmail() adminEmail!: string;
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() adminFullName?: string;
}
