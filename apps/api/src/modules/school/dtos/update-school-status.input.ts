import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { IsBoolean, IsUUID } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SchoolGqlInputNames.UPDATE_SCHOOL_STATUS_INPUT)
export class UpdateSchoolStatusInput {
  @Field() @IsUUID() schoolId!: string;
  @Field() @IsBoolean() isActive!: boolean;
}
