import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SchoolAdminGqlInputNames } from "@schoolAdmin/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { ReviewAction } from "@enums/reviewAction-register";
import { SchoolRole } from "@prisma/client";

@InputType(SchoolAdminGqlInputNames.REVIEW_MEMBERSHIP_INPUT)
export class ReviewMembershipInput {
  @Field() @IsString() @IsNotEmpty() membershipId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() reason?: string;
  @Field(() => ReviewAction) @IsEnum(ReviewAction) action!: ReviewAction;

  @Field(() => SchoolRole, { nullable: true })
  @IsOptional()
  @IsEnum(SchoolRole)
  finalRole?: SchoolRole;
}
