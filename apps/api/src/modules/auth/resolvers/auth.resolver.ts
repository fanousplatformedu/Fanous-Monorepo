import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthPayloadEntity } from "@auth/entities/auth-entity";
import { CreateUserInput } from "src/modules/user/dto/user.input";
import { AuthService } from "@auth/services/auth.service";
import { SignInInput } from "@auth/dto/signin.input";
import { QueryNames } from "@common/enums/gql-names.enum";
import { Public } from "@decorators/public.decorator";

@Resolver(() => AuthPayloadEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthPayloadEntity, { name: QueryNames.SIGN_UP })
  async signUp(@Args("signUpInput") signUpInput: CreateUserInput) {
    const user = await this.authService.registerAndLogin(signUpInput);
    return this.authService.login(user);
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, { name: QueryNames.SIGN_IN })
  async signIn(@Args("signInInput") signInInput: SignInInput) {
    const user = await this.authService.validateLocalUser(signInInput);
    return await this.authService.login(user);
  }
}
