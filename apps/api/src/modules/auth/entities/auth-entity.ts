import { Field, ObjectType, ID } from "@nestjs/graphql";
import { GqlObjectNames } from "@enums/gql-names.enum";
import { Role } from "@prisma/client";

@ObjectType(GqlObjectNames.AUTH_PAYLOAD)
export class AuthPayloadEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  accessToken!: string;

  @Field(() => Role)
  role!: Role;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  avatar?: string;
}
