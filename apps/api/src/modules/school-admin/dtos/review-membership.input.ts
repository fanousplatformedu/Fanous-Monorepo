import { IsIn, IsOptional, IsString, IsUUID } from "class-validator";
import { SchoolAdminGqlInputNames } from "@schoolAdmin/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SchoolAdminGqlInputNames.REVIEW_MEMBERSHIP_INPUT)
export class ReviewMembershipInput {
  @Field() @IsUUID() membershipId!: string;
  @Field() @IsIn(["APPROVE", "REJECT"]) action!: "APPROVE" | "REJECT";
  @Field({ nullable: true }) @IsOptional() @IsString() reason?: string;
}
