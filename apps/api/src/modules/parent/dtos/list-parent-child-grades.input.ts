import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { ParentGqlInputNames } from "@parent/enums/gql-names.enum";

@InputType(ParentGqlInputNames.ListParentChildGradesInput)
export class ListParentChildGradesInput {
  @Field() @IsString() childId!: string;
  @Field(() => Int) @IsInt() @Min(0) take!: number;
  @Field(() => Int) @IsInt() @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() subject!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() termLabel!: string;
}
