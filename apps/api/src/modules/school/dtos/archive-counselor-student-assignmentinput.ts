import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType(SchoolGqlInputNames.ArchiveCounselorStudentAssignmentInput)
export class ArchiveCounselorStudentAssignmentInput {
  @Field() @IsString() assignmentId!: string;
}
