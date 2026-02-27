import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { SchoolStatus } from "@prisma/client";

@InputType(SchoolGqlInputNames.SetSchoolStatusInput)
export class SetSchoolStatusInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field(() => String) @IsEnum(SchoolStatus) status!: SchoolStatus;
}
