import { ParentRelationType, UserStatus } from "@prisma/client";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(ParentGqlObjectNames.ParentChild)
export class ParentChildEntity {
  @Field() id!: string;
  @Field() isPrimary!: boolean;
  @Field(() => String) status!: UserStatus;
  @Field({ nullable: true }) email!: string;
  @Field({ nullable: true }) mobile!: string;
  @Field({ nullable: true }) fullName!: string;
  @Field({ nullable: true }) avatarUrl!: string;
  @Field(() => ParentRelationType) relation!: ParentRelationType;
  @Field(() => GraphQLISODateTime, { nullable: true }) createdAt!: Date;
}
