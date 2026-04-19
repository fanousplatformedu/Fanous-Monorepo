import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { ParentResourceCategory } from "@prisma/client";
import { Field, InputType, Int } from "@nestjs/graphql";
import { ParentGqlInputNames } from "@parent/enums/gql-names.enum";

@InputType(ParentGqlInputNames.ListParentResourcesInput)
export class ListParentResourcesInput {
  @Field(() => Int) @IsInt() @Min(0) take!: number;
  @Field(() => Int) @IsInt() @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query!: string;
  @Field(() => ParentResourceCategory, { nullable: true })
  @IsOptional()
  @IsEnum(ParentResourceCategory)
  category!: ParentResourceCategory;
}
