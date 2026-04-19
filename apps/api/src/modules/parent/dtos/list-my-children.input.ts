import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { ParentGqlInputNames } from "@parent/enums/gql-names.enum";

@InputType(ParentGqlInputNames.ListMyChildrenInput)
export class ListMyChildrenInput {
  @Field(() => Int) @IsInt() @Min(0) take!: number;
  @Field(() => Int) @IsInt() @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query!: string;
}
