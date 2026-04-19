import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsOptional, IsString, Min } from "class-validator";
import { StudentDashboardGqlInputNames } from "@student/enums/gql-names.enum";
import { StudentAssignmentStatus } from "@prisma/client";

registerEnumType(StudentAssignmentStatus, {
  name: "StudentAssignmentStatus",
});

@InputType(StudentDashboardGqlInputNames.ListMyAssignmentsInput)
export class ListMyAssignmentsInput {
  @Field(() => Int, { defaultValue: 0 }) @Min(0) skip!: number;
  @Field(() => Int, { defaultValue: 10 }) @Min(1) take!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query?: string;
  @Field(() => StudentAssignmentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(StudentAssignmentStatus)
  status?: StudentAssignmentStatus;
}
