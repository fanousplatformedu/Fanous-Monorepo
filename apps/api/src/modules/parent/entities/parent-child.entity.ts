import { ParentChildCurrentEnrollmentEntity } from "@parent/entities/parent-child-current-enrollment.entity";
import { ParentRelationType, UserStatus } from "@prisma/client";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(ParentGqlObjectNames.ParentChild)
export class ParentChildEntity {
  @Field() id!: string;
  @Field() isPrimary!: boolean;
  @Field({ nullable: true }) email!: string;
  @Field({ nullable: true }) mobile!: string;
  @Field({ nullable: true }) fullName!: string;
  @Field({ nullable: true }) avatarUrl!: string;
  @Field(() => ParentRelationType) relation!: ParentRelationType;
  @Field(() => UserStatus, { nullable: true }) status!: UserStatus;
  @Field(() => GraphQLISODateTime, { nullable: true }) createdAt!: Date;
  @Field(() => ParentChildCurrentEnrollmentEntity, { nullable: true })
  currentEnrollment!: ParentChildCurrentEnrollmentEntity;
}
