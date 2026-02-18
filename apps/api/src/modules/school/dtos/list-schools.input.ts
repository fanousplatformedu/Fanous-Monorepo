import { IsBoolean, IsInt, IsOptional } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { IsString, Max, Min } from "class-validator";

@InputType(SchoolGqlInputNames.LIST_SCHOOL_INPUT)
export class ListSchoolsInput {
  @Field({ nullable: true }) @IsOptional() @IsString() q?: string;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() take?: number;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() skip?: number;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() onlyActive?: boolean;
}
