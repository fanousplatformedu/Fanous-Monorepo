import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { UserStatus } from "@prisma/client";

@ObjectType(SchoolGqlObjectNames.SchoolCounselor)
export class SchoolCounselorEntity {
  @Field() id!: string;
  @Field(() => UserStatus) status!: UserStatus;
  @Field(() => String, { nullable: true }) email!: string | null;
  @Field(() => String, { nullable: true }) mobile!: string | null;
  @Field(() => String, { nullable: true }) fullName!: string | null;
  @Field(() => String, { nullable: true }) avatarUrl!: string | null;
}
