import { MembershipStatus, SchoolRole } from "@prisma/client";
import { SchoolAdminGqlEntityNames } from "@schoolAdmin/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(SchoolAdminGqlEntityNames.MEMBERSHIP_REQUEST)
export class MembershipRequestEntity {
  @Field() id!: string;
  @Field() userId!: string;
  @Field() createdAt!: Date;
  @Field() schoolId!: string;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) phone?: string;
  @Field({ nullable: true }) grade?: string;
  @Field({ nullable: true }) lastName?: string;
  @Field({ nullable: true }) reviewedAt?: Date;
  @Field({ nullable: true }) firstName?: string;
  @Field(() => String) status!: MembershipStatus;
  @Field({ nullable: true }) nationalId?: string;
  @Field({ nullable: true }) reviewNote?: string;
  @Field({ nullable: true }) reviewedById?: string;
  @Field(() => SchoolRole) requestedRole!: SchoolRole;
  @Field(() => SchoolRole, { nullable: true }) approvedRole?: SchoolRole;
}
