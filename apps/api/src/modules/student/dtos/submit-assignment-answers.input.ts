import { ArrayMinSize, IsArray, IsString } from "class-validator";
import { StudentDashboardGqlInputNames } from "@student/enums/gql-names.enum";
import { AssignmentDraftAnswerInput } from "@student/dtos/assignments-draft.input";
import { Field, InputType } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@InputType(StudentDashboardGqlInputNames.SubmitAssignmentAnswersInput)
export class SubmitAssignmentAnswersInput {
  @Field(() => String)
  @IsString()
  studentAssignmentId!: string;

  @Field(() => [AssignmentDraftAnswerInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AssignmentDraftAnswerInput)
  answers!: AssignmentDraftAnswerInput[];
}
