import { Field, InputType, Int } from "@nestjs/graphql";
import { Min, IsInt, IsString } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";

@InputType(SchoolGqlInputNames.ListEnrollmentsByClassroomInput)
export class ListEnrollmentsByClassroomInput {
  @Field(() => Int) @IsInt() take!: number;
  @Field(() => Int) @IsInt() skip!: number;
  @Field(() => String) @IsString() schoolId!: string;
  @Field(() => String) @IsString() classroomId!: string;
}
