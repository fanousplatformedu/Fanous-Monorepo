import { IsEnum, IsIn, IsOptional, IsString, IsUUID } from "class-validator";
import { SchoolAdminGqlInputNames } from "@schoolAdmin/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { SchoolRole } from "@prisma/client";

@InputType(SchoolAdminGqlInputNames.REVIEW_MEMBERSHIP_INPUT)
export class ReviewMembershipInput {
  @Field() @IsUUID() membershipId!: string;
  @Field() @IsIn(["APPROVE", "REJECT"]) action!: "APPROVE" | "REJECT";
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(SchoolRole)
  finalRole?: SchoolRole;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  reason?: string;
}
