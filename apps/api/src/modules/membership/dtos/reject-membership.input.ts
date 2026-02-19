import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MembershipGqlInputNames } from "@membership/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(MembershipGqlInputNames.REJECT_MEMBERSHIP_INPUT)
export class RejectMembershipInput {
  @Field() @IsString() @IsNotEmpty() membershipId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() reason?: string;
}
