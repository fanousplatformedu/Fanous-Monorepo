import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from "class-validator";
import { CounselorGqlInputNames } from "@counselor/enums/gql-names";
import { Field, InputType } from "@nestjs/graphql";

@InputType(CounselorGqlInputNames.COMPARE_STUDENT_RESULTS)
export class CompareStudentResultsInput {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  studentIds!: string[];
}
