import { IsEnum, IsOptional, IsString } from "class-validator";
import { MembershipStatus, SchoolRole } from "@prisma/client";
import { SchoolAdminGqlInputNames } from "@schoolAdmin/enums/gql-names.enum";
import { Field, InputType, Int } from "@nestjs/graphql";

@InputType(SchoolAdminGqlInputNames.LIST_MEMBERSHIP_REQUESTS_INPUT)
export class ListMembershipRequestsInput {
  @Field({ nullable: true }) @IsOptional() @IsString() q?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() to?: string;
  @Field(() => Int, { nullable: true }) @IsOptional() take?: number;
  @Field(() => Int, { nullable: true }) @IsOptional() skip?: number;
  @Field({ nullable: true }) @IsOptional() @IsString() from?: string;
  @Field(() => MembershipStatus, { nullable: true })
  @IsOptional()
  @IsEnum(MembershipStatus)
  status?: MembershipStatus;

  @Field(() => SchoolRole, { nullable: true })
  @IsOptional()
  @IsEnum(SchoolRole)
  requestedRole?: SchoolRole;

  @Field(() => SchoolRole, { nullable: true })
  @IsOptional()
  @IsEnum(SchoolRole)
  approvedRole?: SchoolRole;
}
