import { MembershipStatus, SchoolRole } from "@prisma/client";
import { AdminGqlEntityNames } from "@superAdmin/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(AdminGqlEntityNames.SCHOOL_ADMIN)
export class SchoolAdminEntity {
  @Field() userId!: string;
  @Field() createdAt!: Date;
  @Field() schoolId!: string;
  @Field() membershipId!: string;
  @Field(() => String) role!: SchoolRole;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) phone?: string;
  @Field({ nullable: true }) lastName?: string;
  @Field({ nullable: true }) reviewedAt?: Date;
  @Field({ nullable: true }) firstName?: string;
  @Field(() => String) status!: MembershipStatus;
  @Field({ nullable: true }) reviewedById?: string;
}
