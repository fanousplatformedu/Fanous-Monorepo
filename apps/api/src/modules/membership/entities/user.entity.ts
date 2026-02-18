import { MembershipGqlEntityNames } from "@modules/membership/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { GlobalRole } from "@prisma/client";

@ObjectType(MembershipGqlEntityNames.USER)
export class UserEntity {
  @Field() id!: string;
  @Field() isActive!: boolean;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) phone?: string;
  @Field(() => String) globalRole!: GlobalRole;
}
