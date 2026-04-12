import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { AssessmentGqlInputNames } from "@assessment/enums/gql-names.enum";
import { Field, InputType, Int } from "@nestjs/graphql";

@InputType(AssessmentGqlInputNames.ListAssessmentResultsInput)
export class ListAssessmentResultsInput {
  @Field(() => Int, { defaultValue: 0 }) @IsInt() skip!: number;
  @Field(() => Int, { defaultValue: 20 }) @IsInt() take!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() assignmentId?: string;
}
