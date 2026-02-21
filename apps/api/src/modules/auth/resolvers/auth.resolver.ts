import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RequestOtpResultEntity } from "@auth/entities/request-otp-result.entity";
import { RefreshSuperAdminInput } from "@auth/dtos/refresh-super-admin.input";
import { LogoutSuperAdminInput } from "@auth/dtos/logout-super-admin.input";
import { SignInSuperAdminInput } from "@auth/dtos/sign-super-admin.input";
import { RequestLoginOtpInput } from "@auth/dtos/request-login-otp.input";
import { VerifyLoginOtpInput } from "@auth/dtos/verify-login-otp.input";
import { LogoutResultEntity } from "@auth/entities/logout-result.entity";
import { AuthPayloadEntity } from "@auth/entities/auth-payload.entity";
import { RefreshTokenInput } from "@auth/dtos/refresh-token.input";
import { GqlMutationNames } from "@auth/enums/gql-names.enum";
import { AuthMessages } from "@auth/enums/auth-message.enum";
import { AuthService } from "@auth/services/auth.service";
import { LogoutInput } from "@auth/dtos/logout.input";
import { Public } from "@decorators/public.decorator";

type GqlCtx = { req: any; res: any };

@Resolver()
export class AuthResolver {
  constructor(private auth: AuthService) {}

  @Public()
  @Mutation(() => RequestOtpResultEntity, {
    name: GqlMutationNames.REQUEST_LOGIN_OTP,
  })
  async requestLoginOtp(@Args("input") input: RequestLoginOtpInput) {
    const { resendAfter } = await this.auth.requestLoginOtp({
      schoolId: input.schoolId,
      identifier: input.identifier,
      loginAs: input.loginAs,
    });
    return { message: AuthMessages.OTP_SENT, resendAfter };
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, {
    name: GqlMutationNames.VERIFY_LOGIN_OTP,
  })
  async verifyLoginOtp(
    @Args("input") input: VerifyLoginOtpInput,
    @Context() ctx: GqlCtx,
  ) {
    const payload = await this.auth.verifyLoginOtp({
      schoolId: input.schoolId,
      identifier: input.identifier,
      code: input.code,
      loginAs: input.loginAs,
    });

    this.auth.setSchoolAuthCookies({
      res: ctx.res,
      tokens: {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      },
    });
    return payload;
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, { name: GqlMutationNames.REFRESH_TOKEN })
  async refreshToken(
    @Args("input") input: RefreshTokenInput,
    @Context() ctx: GqlCtx,
  ) {
    const refreshTokenRaw = this.auth.getCookie({
      req: ctx.req,
      name: "sk_rt",
    });

    const payload = await this.auth.rotateRefreshToken({
      schoolId: input.schoolId,
      refreshTokenRaw,
    });

    this.auth.setSchoolAuthCookies({
      res: ctx.res,
      tokens: {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      },
    });
    return payload;
  }

  @Public()
  @Mutation(() => LogoutResultEntity, { name: GqlMutationNames.LOGOUT })
  async logout(@Args("input") input: LogoutInput, @Context() ctx: GqlCtx) {
    const refreshTokenRaw = this.auth.getCookie({
      req: ctx.req,
      name: "sk_rt",
    });
    await this.auth.logout({ schoolId: input.schoolId, refreshTokenRaw });
    this.auth.clearSchoolAuthCookies({ res: ctx.res });
    return { message: AuthMessages.LOGOUT_OK };
  }

  // ============= super admin ============
  @Public()
  @Mutation(() => AuthPayloadEntity, {
    name: GqlMutationNames.SIGNIN_SUPER_ADMIN,
  })
  async signInSuperAdmin(
    @Args("input") input: SignInSuperAdminInput,
    @Context() ctx: GqlCtx,
  ) {
    const payload = await this.auth.signInSuperAdmin({
      email: input.email,
      password: input.password,
    });
    this.auth.setSuperAdminAuthCookies({
      res: ctx.res,
      tokens: {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      },
    });
    return payload;
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, {
    name: GqlMutationNames.REFRESH_SUPER_ADMIN,
  })
  async refreshSuperAdminToken(
    @Args("input") _input: RefreshSuperAdminInput,
    @Context() ctx: GqlCtx,
  ) {
    const refreshTokenRaw = this.auth.getCookie({
      req: ctx.req,
      name: "sa_rt",
    });
    const payload = await this.auth.rotateSuperAdminRefreshToken({
      refreshTokenRaw,
    });
    this.auth.setSuperAdminAuthCookies({
      res: ctx.res,
      tokens: {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      },
    });
    return payload;
  }

  @Public()
  @Mutation(() => LogoutResultEntity, {
    name: GqlMutationNames.LOGOUT_SUPER_ADMIN,
  })
  async logoutSuperAdmin(
    @Args("input") _input: LogoutSuperAdminInput,
    @Context() ctx: GqlCtx,
  ) {
    const refreshTokenRaw = this.auth.getCookie({
      req: ctx.req,
      name: "sa_rt",
    });
    await this.auth.logoutSuperAdmin({ refreshTokenRaw });
    this.auth.clearSuperAdminAuthCookies({ res: ctx.res });
    return { message: AuthMessages.LOGOUT_OK };
  }
}
