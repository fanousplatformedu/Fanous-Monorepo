import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { ParentGqlInputNames } from "@parent/enums/gql-names.enum";
import { IntelligenceKey } from "@prisma/client";

@InputType(ParentGqlInputNames.ListParentChildResultsInput)
export class ListParentChildResultsInput {
  @Field() @IsString() childId!: string;
  @Field(() => Int) @IsInt() @Min(0) take!: number;
  @Field(() => Int) @IsInt() @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query!: string;
  @Field(() => IntelligenceKey, { nullable: true })
  @IsOptional()
  @IsEnum(IntelligenceKey)
  dominantIntelligence!: IntelligenceKey;
}
