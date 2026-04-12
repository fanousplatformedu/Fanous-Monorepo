import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";

@InputType(SchoolGqlInputNames.ListClassroomsInput)
export class ListClassroomsInput {
  @Field() @IsString() schoolId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() query?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() gradeId?: string;
  @Field(() => Int, { defaultValue: 0 }) @IsInt() @Min(0) skip!: number;
  @Field(() => Int, { defaultValue: 20 }) @IsInt() @Min(1) take!: number;
  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;
}
