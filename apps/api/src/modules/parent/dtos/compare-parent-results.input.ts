import { IsNotEmpty, IsString } from "class-validator";
import { ParentGqlInputNames } from "@parent/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(ParentGqlInputNames.CompareParentResultsInput)
export class CompareParentResultsInput {
  @Field() @IsString() @IsNotEmpty() childId!: string;
  @Field() @IsString() @IsNotEmpty() baseResultId!: string;
  @Field() @IsString() @IsNotEmpty() compareWithResultId!: string;
}
