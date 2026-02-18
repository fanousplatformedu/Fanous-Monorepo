import { MembershipStatus, SchoolRole } from "@prisma/client";
import { MembershipGqlEntityNames } from "@membership/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { UserEntity } from "@membership/entities/user.entity";

@ObjectType(MembershipGqlEntityNames.MMEMBERSHIP)
export class MembershipEntity {
  @Field() id!: string;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
  @Field() schoolId!: string;
  @Field(() => String) role!: SchoolRole;
  @Field({ nullable: true }) grade?: string;
  @Field(() => UserEntity) user!: UserEntity;
  @Field({ nullable: true }) lastName?: string;
  @Field({ nullable: true }) reviewedAt?: Date;
  @Field({ nullable: true }) firstName?: string;
  @Field(() => String) status!: MembershipStatus;
  @Field({ nullable: true }) nationalId?: string;
  @Field({ nullable: true }) reviewedById?: string;
}
