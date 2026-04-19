import { StudentDashboardGqlInputNames } from "@student/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType(StudentDashboardGqlInputNames.CompareResultsInput)
export class CompareResultsInput {
  @Field(() => String) @IsString() baseResultId!: string;
  @Field(() => String) @IsString() compareWithResultId!: string;
}
