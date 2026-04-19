import { IsString, IsUrl, MaxLength } from "class-validator";
import { IsDateString, IsOptional } from "class-validator";
import { CounselorGqlInputNames } from "@counselor/enums/gql-names";
import { Field, InputType } from "@nestjs/graphql";

@InputType(CounselorGqlInputNames.SCHEDULE_COUNSELOR_SESSION)
export class ScheduleCounselorSessionInput {
  @Field() @IsString() studentId!: string;
  @Field() @IsDateString() scheduledAt!: string;
  @Field() @IsString() @MaxLength(150) title!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() note?: string;
  @Field({ nullable: true }) @IsOptional() @IsUrl() meetingUrl?: string;
}
