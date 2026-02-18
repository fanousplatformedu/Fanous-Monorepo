import { IsOptional, IsString, IsUUID } from "class-validator";
import { MembershipGqlInputNames } from "@modules/membership/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(MembershipGqlInputNames.REJECT_MEMBERSHIP_INPUT)
export class RejectMembershipInput {
  @Field() @IsUUID() membershipId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() reason?: string;
}
