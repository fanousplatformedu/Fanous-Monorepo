import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { AssessmentGqlInputNames, AssessmentGqlObjectNames } from "@assessment/enums/gql-names.enum";
import { Field, InputType, Int } from "@nestjs/graphql";

@InputType(AssessmentGqlInputNames.AssessmentResultInput)
export class AssessmentResultInput {
  @Field()  @IsString() studentId: string;
  @Field()  @IsString() assignmentId: string;
}
