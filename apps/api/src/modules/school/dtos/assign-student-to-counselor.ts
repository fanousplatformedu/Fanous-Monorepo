import { Field, InputType } from "@nestjs/graphql";
import { ArrayMinSize, IsArray, IsString } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";

@InputType(SchoolGqlInputNames.AssignStudentsToCounselorInput)
export class AssignStudentsToCounselorInput {
  @Field() @IsString() schoolId!: string;
  @Field() @IsString() counselorId!: string;
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  studentIds!: string[];
}
