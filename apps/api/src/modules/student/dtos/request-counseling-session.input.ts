import { IsDateString, IsOptional, IsString, IsUrl } from "class-validator";
import { StudentDashboardGqlInputNames } from "@student/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(StudentDashboardGqlInputNames.RequestCounselingSessionInput)
export class RequestCounselingSessionInput {
  @Field(() => String) @IsString() title!: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  note?: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  meetingUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  counselorId?: string;
}
