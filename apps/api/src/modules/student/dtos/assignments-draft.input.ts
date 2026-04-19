import { StudentDashboardGqlInputNames } from "@student/enums/gql-names.enum";
import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, Max, Min } from "class-validator";

@InputType(StudentDashboardGqlInputNames.AssignmentDraftAnswerInput)
export class AssignmentDraftAnswerInput {
  @Field(() => Int) @IsInt() @Max(5) value!: number;
  @Field(() => Int) @IsInt() @Min(1) questionNumber!: number;
}
