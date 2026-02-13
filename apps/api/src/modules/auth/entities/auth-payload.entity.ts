import { Field, ObjectType } from "@nestjs/graphql";
import { GqlEntityNames } from "@auth/enum/gql-names.enum";
import { Role } from "@prisma/client";

@ObjectType(GqlEntityNames.AUTH_PAYLOAD)
export class AuthPayloadEntity {
  @Field(() => Role) role!: Role;
  @Field(() => String) id!: string;
  @Field(() => String) accessToken!: string;
  @Field(() => String) refreshToken!: string;
  @Field(() => String, { nullable: true }) name?: string;
  @Field(() => String, { nullable: true }) avatar?: string;
}
