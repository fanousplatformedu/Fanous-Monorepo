import { Field, ObjectType } from "@nestjs/graphql";
import { GqlEntityNames } from "@auth/enum/gql-names.enum";
import { Role } from "@prisma/client";

@ObjectType(GqlEntityNames.AUTH_REGISTER_STATUS)
export class AuthRegisterStatusEntity {
  @Field(() => Boolean) ok!: boolean;
  @Field(() => String) userId!: string;
  @Field(() => Role) desiredRole!: Role;
}
