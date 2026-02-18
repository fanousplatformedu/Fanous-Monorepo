import { MembershipGqlInputNames } from "@modules/membership/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@InputType(MembershipGqlInputNames.APPROVE_MEMBERSHIP_INPUT)
export class ApproveMembershipInput {
  @Field() @IsUUID() membershipId!: string;
}
