import {
  IsArray,
  IsInt,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import { AssessmentGqlInputNames } from "@assessment/enums/gql-names.enum";
import { Field, InputType, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";

@InputType(AssessmentGqlInputNames.StudentAnswerInput)
export class StudentAnswerInput {
  @Field() @IsString() questionId!: string;
  @Field(() => Int) @IsInt() value!: number;
}

@InputType(AssessmentGqlInputNames.SubmitStudentAnswersInput)
export class SubmitStudentAnswersInput {
  @Field() @IsString() studentAssignmentId!: string;
  @Field(() => [StudentAnswerInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAnswerInput)
  answers!: StudentAnswerInput[];
}
