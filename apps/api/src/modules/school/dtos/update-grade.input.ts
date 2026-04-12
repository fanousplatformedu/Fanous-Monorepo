import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SchoolGqlInputNames.UpdateGradeInput)
export class UpdateGradeInput {
  @Field() @IsString() @IsNotEmpty() id!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() name?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() code?: string;
}
