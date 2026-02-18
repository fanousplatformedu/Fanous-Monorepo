import { IsOptional, IsString, Length, Matches } from "class-validator";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SchoolGqlInputNames.CREATE_SCHOOL_INPUT)
export class CreateSchoolInput {
  @Field({ description: "subdomain" })
  @IsString()
  @IsNotEmpty()
  @Length(3, 40)
  @Matches(/^[a-zA-Z0-9][a-zA-Z0-9-_]+[a-zA-Z0-9]$/, {
    message: "code must be alphanumeric and may contain - or _",
  })
  code!: string;

  @Field() @IsString() @IsNotEmpty() @Length(2, 120) name!: string;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() isActive?: boolean;
}
