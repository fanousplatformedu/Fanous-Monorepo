import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RequestOtpResultEntity } from "@auth/entities/request-otp-result.entity";
import { RequestLoginOtpInput } from "@auth/dtos/request-login-otp.input";
import { VerifyLoginOtpInput } from "@modules/auth/dtos/verify-login-otp.input";
import { LogoutResultEntity } from "@auth/entities/logout-result.entity";
import { AuthPayloadEntity } from "@auth/entities/auth-payload.entity";
import { RefreshTokenInput } from "@auth/dtos/refresh-token.input";
import { GqlMutationNames } from "@auth/enums/gql-names.enum";
import { AuthMessages } from "@auth/enums/auth-message.enum";
import { AuthService } from "@auth/services/auth.service";
import { LogoutInput } from "@auth/dtos/logout.input";
import { Public } from "@decorators/public.decorator";

@Resolver()
export class AuthResolver {
  constructor(private auth: AuthService) {}

  @Public()
  @Query(() => String, { name: "healthCheck" })
  healthCheck(): string {
    return "ok";
  }

  @Public()
  @Mutation(() => RequestOtpResultEntity, {
    name: GqlMutationNames.REQUEST_LOGIN_OTP,
  })
  async requestLoginOtp(
    @Args("input") input: RequestLoginOtpInput,
  ): Promise<RequestOtpResultEntity> {
    const { resendAfter } = await this.auth.requestLoginOtp(
      input.schoolId,
      input.identifier,
    );
    return { message: AuthMessages.OTP_SENT, resendAfter };
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, {
    name: GqlMutationNames.VERIFY_LOGIN_OTP,
  })
  async verifyLoginOtp(
    @Args("input") input: VerifyLoginOtpInput,
  ): Promise<AuthPayloadEntity> {
    return this.auth.verifyLoginOtp(
      input.schoolId,
      input.identifier,
      input.code,
    );
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, { name: GqlMutationNames.REFRESH_TOKEN })
  async refreshToken(
    @Args("input") input: RefreshTokenInput,
  ): Promise<AuthPayloadEntity> {
    return this.auth.rotateRefreshToken(input.schoolId, input.refreshToken);
  }

  @Public()
  @Mutation(() => LogoutResultEntity, { name: GqlMutationNames.LOGOUT })
  async logout(@Args("input") input: LogoutInput): Promise<LogoutResultEntity> {
    await this.auth.logout(input.schoolId, input.refreshToken);
    return { message: AuthMessages.LOGOUT_OK };
  }
}
