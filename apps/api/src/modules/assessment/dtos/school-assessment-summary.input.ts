import { AssessmentGqlInputNames } from "@assessment/enums/gql-names.enum";
import { IsOptional, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType(AssessmentGqlInputNames.SchoolAssessmentSummaryInput)
export class SchoolAssessmentSummaryInput {
  @Field({ nullable: true }) @IsOptional() @IsString() assignmentId?: string;
}
