import { IsArray, IsOptional, IsString } from "class-validator";
import { AssessmentGqlInputNames } from "@assessment/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(AssessmentGqlInputNames.AssignAssignmentInput)
export class AssignAssignmentInput {
  @Field() @IsString() assignmentId!: string;
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  studentIds?: string[];
}
