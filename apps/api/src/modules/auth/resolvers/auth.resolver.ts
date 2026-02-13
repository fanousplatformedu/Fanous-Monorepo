import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthRegisterRequestInput } from "@auth/dto/register-request.input";
import { AuthRegisterStatusEntity } from "@auth/entities/register-status.entity";
import { AuthRefreshTokenInput } from "@auth/dto/refresh-token.input";
import { AuthRequestOtpInput } from "@auth/dto/request-otp.input";
import { AuthVerifyOtpInput } from "@auth/dto/verify-otp.input";
import { AuthPayloadEntity } from "@auth/entities/auth-payload.entity";
import { GqlQueryNames } from "@auth/enum/gql-names.enum";
import { AuthService } from "@auth/services/auth.service";
import { Public } from "@decorators/public.decorator";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => AuthRegisterStatusEntity, {
    name: GqlQueryNames.AUTH_REGISTER_REQUEST,
  })
  authRegisterRequest(@Args("input") input: AuthRegisterRequestInput) {
    return this.authService.registerRequest(input);
  }

  @Public()
  @Mutation(() => Boolean, { name: GqlQueryNames.AUTH_REQUEST_OTP })
  authRequestOtp(@Args("input") input: AuthRequestOtpInput) {
    return this.authService.requestOtp(input).then(() => true);
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, { name: GqlQueryNames.AUTH_VERIFY_OTP })
  authVerifyOtp(@Args("input") input: AuthVerifyOtpInput) {
    return this.authService.verifyOtp(input);
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, { name: GqlQueryNames.AUTH_REFRESH_TOKEN })
  authRefreshToken(@Args("input") input: AuthRefreshTokenInput) {
    return this.authService.refresh(input.refreshToken);
  }

  @Mutation(() => Boolean, { name: GqlQueryNames.AUTH_LOGOUT })
  authLogout(@Args("refreshToken") refreshToken: string) {
    return this.authService.logout(refreshToken).then(() => true);
  }
}
