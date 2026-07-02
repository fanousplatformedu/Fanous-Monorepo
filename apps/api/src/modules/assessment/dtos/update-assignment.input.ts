import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { AssessmentGqlInputNames } from "@assessment/enums/gql-names.enum";
import { AssignmentStatus, AssignmentTargetMode } from "@prisma/client";
import { Field, InputType } from "@nestjs/graphql";

@InputType(AssessmentGqlInputNames.UpdateAssignmentInput)
export class UpdateAssignmentInput {
  @Field() @IsString() @IsNotEmpty() assignmentId!: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  title?: string;
  @Field({ nullable: true }) @IsOptional() @IsDateString() dueAt?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() description?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() targetGradeId?: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(AssignmentTargetMode)
  targetMode?: AssignmentTargetMode;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  targetClassroomId?: string;
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  targetStudentIds?: string[];
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;
}
