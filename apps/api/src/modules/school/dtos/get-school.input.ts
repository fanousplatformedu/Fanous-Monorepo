import { IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SchoolGqlInputNames.GET_SCHOOL_INPUT)
export class GetSchoolInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.code)
  id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.id)
  code?: string;
}
