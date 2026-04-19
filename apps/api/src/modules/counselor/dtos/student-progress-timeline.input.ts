import { IsInt, IsOptional, IsString } from "class-validator";
import { CounselorGqlInputNames } from "@counselor/enums/gql-names";
import { Field, InputType, Int } from "@nestjs/graphql";

@InputType(CounselorGqlInputNames.STUDENT_PROGRESS_TIMELINE)
export class StudentProgressTimelineInput {
  @Field() @IsString() studentId!: string;
  @Field(() => Int, { defaultValue: 12 })
  @IsOptional()
  @IsInt()
  limit?: number = 12;
}
