import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { AdminGqlInputNames } from "@superAdmin/enums/gql-names.enum";
import { MembershipStatus } from "@prisma/client";

@InputType(AdminGqlInputNames.LIST_SCHOOL_ADMINS_INPUT)
export class ListSchoolAdminsInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field(() => Int, { nullable: true }) @IsOptional() take?: number;
  @Field(() => Int, { nullable: true }) @IsOptional() skip?: number;
  @Field(() => MembershipStatus, { nullable: true })
  @IsOptional()
  @IsEnum(MembershipStatus)
  status?: MembershipStatus;
}
