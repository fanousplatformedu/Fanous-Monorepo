import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MembershipGqlInputNames } from "@membership/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { SchoolRole } from "@prisma/client";

@InputType(MembershipGqlInputNames.APPROVE_MEMBERSHIP_INPUT)
export class ApproveMembershipInput {
  @Field() @IsString() @IsNotEmpty() membershipId!: string;
  @Field(() => String, { nullable: true }) @IsOptional() finalRole?: SchoolRole;
}
