import { MembershipGqlInputNames } from "@membership/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsUUID } from "class-validator";
import { SchoolRole } from "@prisma/client";

@InputType(MembershipGqlInputNames.APPROVE_MEMBERSHIP_INPUT)
export class ApproveMembershipInput {
  @Field() @IsUUID() membershipId!: string;
  @Field(() => String, { nullable: true }) @IsOptional() finalRole?: SchoolRole;
}
