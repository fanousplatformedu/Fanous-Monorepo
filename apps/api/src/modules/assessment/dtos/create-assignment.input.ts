import { IsOptional, IsString, MaxLength } from "class-validator";
import { AssessmentGqlInputNames } from "@assessment/enums/gql-names.enum";
import { IsDateString, IsEnum } from "class-validator";
import { AssignmentTargetMode } from "@prisma/client";
import { Field, InputType } from "@nestjs/graphql";

@InputType(AssessmentGqlInputNames.CreateAssignmentInput)
export class CreateAssignmentInput {
  @Field() @IsString() @MaxLength(180) title!: string;
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
}
