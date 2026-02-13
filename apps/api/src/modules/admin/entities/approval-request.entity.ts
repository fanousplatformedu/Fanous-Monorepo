import { ApprovalStatus, Role } from "@prisma/client";
import { Field, ObjectType } from "@nestjs/graphql";
import { SchoolMiniEntity } from "@modules/user/entities/school-mini.entity";
import { GqlEntityNames } from "@admin/enums/gql-names.enum";
import { UserEntity } from "@modules/user/entities/user.entity";

@ObjectType(GqlEntityNames.ROLE_APPROVAL_REQUEST)
export class RoleApprovalRequestEntity {
  @Field(() => String) id!: string;
  @Field(() => Date) createdAt!: Date;
  @Field(() => Date) updatedAt!: Date;
  @Field(() => Role) requestedRole!: Role;
  @Field(() => UserEntity) user!: UserEntity;
  @Field(() => ApprovalStatus) status!: ApprovalStatus;
  @Field(() => String, { nullable: true }) note?: string | null;
  @Field(() => Date, { nullable: true }) reviewedAt?: Date | null;
  @Field(() => UserEntity, { nullable: true })
  reviewedBy?: UserEntity | null;
  @Field(() => SchoolMiniEntity, { nullable: true })
  school?: SchoolMiniEntity | null;
}
