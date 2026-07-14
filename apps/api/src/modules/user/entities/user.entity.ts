import { Field, ObjectType, GraphQLISODateTime } from "@nestjs/graphql";
import { UserGqlObjectNames } from "@user/enums/gql-names.enum";
import { Role, UserStatus } from "@prisma/client";

@ObjectType(UserGqlObjectNames.User)
export class UserEntity {
  @Field(() => String) id!: string;
  @Field(() => String) role!: Role;
  @Field(() => String) status!: UserStatus;
  @Field(() => Boolean) isActive!: boolean;
  @Field(() => GraphQLISODateTime) updatedAt!: Date;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => String, { nullable: true }) email?: string | null;
  @Field(() => String, { nullable: true }) mobile?: string | null;
  @Field(() => String, { nullable: true }) firstName?: string | null;
  @Field(() => String, { nullable: true }) lastName?: string | null;
  @Field(() => String, { nullable: true }) schoolId?: string | null;
  @Field(() => String, { nullable: true }) username?: string | null;
  @Field(() => String, { nullable: true }) avatarUrl?: string | null;
  @Field(() => GraphQLISODateTime, { nullable: true })
  lastLoginAt?: Date | null;
  @Field(() => Boolean, { nullable: true })
  forcePasswordChange?: boolean | null;
}
