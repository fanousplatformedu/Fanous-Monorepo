import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { Role, UserStatus } from "@prisma/client";

@ObjectType(SchoolGqlObjectNames.SchoolAdmin)
export class SchoolAdminEntity {
  @Field()
  id!: string;
  @Field() createdAt!: Date;
  @Field() schoolId!: string;
  @Field(() => String) role!: Role;
  @Field() forcePasswordChange!: boolean;
  @Field(() => String) status!: UserStatus;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) fullName?: string;
  @Field({ nullable: true }) username?: string;
  @Field({ nullable: true }) schoolName?: string;
}
