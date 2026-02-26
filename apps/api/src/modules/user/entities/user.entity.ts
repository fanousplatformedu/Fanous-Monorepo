import { UserGqlObjectNames } from "@user/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { Role, UserStatus } from "@prisma/client";

@ObjectType(UserGqlObjectNames.User)
export class UserEntity {
  @Field() id!: string;
  @Field() updatedAt!: Date;
  @Field() createdAt!: Date;
  @Field(() => String) role!: Role;
  @Field(() => String) status!: UserStatus;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) mobile?: string;
  @Field({ nullable: true }) fullName?: string;
  @Field({ nullable: true }) schoolId?: string;
  @Field({ nullable: true }) username?: string;
  @Field({ nullable: true }) avatarUrl?: string;
}
