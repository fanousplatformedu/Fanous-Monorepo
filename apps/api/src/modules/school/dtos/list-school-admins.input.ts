import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { UserStatus } from "@prisma/client";

@InputType(SchoolGqlInputNames.ListSchoolAdminsInput)
export class ListSchoolAdminsInput {
  @Field(() => Int, { defaultValue: 0 }) @IsInt() @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() schoolId?: string;
  @Field(() => Int, { defaultValue: 20 }) @IsInt() @Min(1) take!: number;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
