import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { SchoolStatus } from "@prisma/client";

@InputType(SchoolGqlInputNames.ListSchoolsInput)
export class ListSchoolsInput {
  @Field({ nullable: true }) @IsOptional() @IsString() query?: string;
  @Field(() => Int, { defaultValue: 0 }) @IsInt() @Min(0) skip!: number;
  @Field(() => Int, { defaultValue: 20 }) @IsInt() @Min(1) take!: number;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(SchoolStatus)
  status?: SchoolStatus;
}
