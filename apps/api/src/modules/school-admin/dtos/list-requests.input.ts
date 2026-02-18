import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { MembershipStatus, SchoolRole } from "@prisma/client";
import { SchoolAdminGqlInputNames } from "@schoolAdmin/enums/gql-names.enum";
import { Field, InputType, Int } from "@nestjs/graphql";

@InputType(SchoolAdminGqlInputNames.LIST_MEMBERSHIP_REQUESTS_INPUT)
export class ListMembershipRequestsInput {
  @Field() @IsUUID() schoolId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() q?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() to?: string;
  @Field(() => Int, { nullable: true }) @IsOptional() take?: number;
  @Field(() => Int, { nullable: true }) @IsOptional() skip?: number;
  @Field({ nullable: true }) @IsOptional() @IsString() from?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(MembershipStatus)
  status?: MembershipStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(SchoolRole)
  role?: SchoolRole;
}
