import { SchoolAdminGqlInputNames } from "@schoolAdmin/enums/gql-names.enum";
import { IsEnum, IsIn, IsString } from "class-validator";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { SchoolRole } from "@prisma/client";

@InputType(SchoolAdminGqlInputNames.REVIEW_MEMBERSHIP_INPUT)
export class ReviewMembershipInput {
  @Field() @IsString() @IsNotEmpty() membershipId!: string;
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
