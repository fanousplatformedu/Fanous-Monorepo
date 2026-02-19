import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SchoolGqlInputNames.UPDATE_SCHOOL_STATUS_INPUT)
export class UpdateSchoolStatusInput {
  @Field() @IsBoolean() isActive!: boolean;
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
}
