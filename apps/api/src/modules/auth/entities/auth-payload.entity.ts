import { Field, ObjectType } from "@nestjs/graphql";
import { GqlObjectNames } from "@auth/enums/gql-names.enum";
import { Role } from "@prisma/client";

@ObjectType(GqlObjectNames.AuthPayload)
export class AuthPayloadEntity {
  @Field() userId!: string;
  @Field() message!: string;
  @Field(() => String) role!: Role;
  @Field({ nullable: true }) schoolId?: string;
  @Field({ nullable: true }) fullName?: string;
}
