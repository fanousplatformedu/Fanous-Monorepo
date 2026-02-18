import { IsOptional, IsString, IsUUID } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SchoolGqlInputNames.GET_SCHOOL_INPUT)
export class GetSchoolInput {
  @Field({ nullable: true }) @IsOptional() @IsUUID() id?: string;
  @Field({ nullable: true, description: "or with school code" })
  @IsOptional()
  @IsString()
  code?: string;
}
