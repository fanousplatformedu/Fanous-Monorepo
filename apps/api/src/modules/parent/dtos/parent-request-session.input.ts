import { IsOptional, IsString } from "class-validator";
import { ParentGqlInputNames } from "@parent/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(ParentGqlInputNames.ParentRequestSessionInput)
export class ParentRequestSessionInput {
  @Field() @IsString() title!: string;
  @Field() @IsString() childId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() note!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() meetingUrl!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() counselorId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() scheduledAt!: string;
}
