import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsOptional, IsString, Min } from "class-validator";
import { StudentDashboardGqlInputNames } from "@student/enums/gql-names.enum";
import { CounselingSessionStatus } from "@prisma/client";

registerEnumType(CounselingSessionStatus, {
  name: "CounselingSessionStatus",
});

@InputType(StudentDashboardGqlInputNames.ListMyCounselingSessionsInput)
export class ListMyCounselingSessionsInput {
  @Field(() => Int, { defaultValue: 0 }) @Min(0) skip!: number;
  @Field(() => Int, { defaultValue: 10 }) @Min(1) take!: number;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  query?: string;

  @Field(() => CounselingSessionStatus, { nullable: true })
  @IsOptional()
  @IsEnum(CounselingSessionStatus)
  status?: CounselingSessionStatus;
}
