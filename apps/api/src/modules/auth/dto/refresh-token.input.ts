import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enum/gql-names.enum";

@InputType(GqlInputNames.AUTH_REFRESH_TOKEN_INPUT)
export class AuthRefreshTokenInput {
  @Field(() => String) refreshToken!: string;
}
