import { StudentDashboardGqlInputNames } from "@student/enums/gql-names.enum";
import { IsOptional, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType(StudentDashboardGqlInputNames.CancelCounselingSessionInput)
export class CancelCounselingSessionInput {
  @Field(() => String) @IsString() sessionId!: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  reason?: string;
}
