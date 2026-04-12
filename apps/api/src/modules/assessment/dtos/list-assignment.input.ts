import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { AssessmentGqlInputNames } from "@assessment/enums/gql-names.enum";
import { Field, InputType, Int } from "@nestjs/graphql";
import { AssignmentStatus } from "@prisma/client";

@InputType(AssessmentGqlInputNames.ListAssignmentsInput)
export class ListAssignmentsInput {
  @Field(() => Int, { defaultValue: 0 }) @IsInt() skip!: number;
  @Field(() => Int, { defaultValue: 20 }) @IsInt() take!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query?: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;
}
