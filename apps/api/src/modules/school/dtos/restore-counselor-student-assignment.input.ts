import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType(SchoolGqlInputNames.RestoreCounselorStudentAssignmentInput)
export class RestoreCounselorStudentAssignmentInput {
  @Field() @IsString() assignmentId!: string;
}
