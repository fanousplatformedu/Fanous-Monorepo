import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AllowForcePasswordChange } from "@superAdmin/decorators/allow-force-password-change.decorator";
import { LogoutResultEntity } from "@auth/entities/logout-result.entity";
import { AuthPayloadEntity } from "@auth/entities/auth-payload.entity";
import { OtpResponseEntity } from "@auth/entities/otp-response.entity";
import { GqlMutationNames } from "@auth/enums/gql-names.enum";
import { AdminLoginInput } from "@auth/dtos/admin-login.input";
import { RequestOtpInput } from "@auth/dtos/request-otp.input";
import { VerifyOtpInput } from "@auth/dtos/verify-otp.input";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { AuthService } from "@auth/services/auth.service";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { UseGuards } from "@nestjs/common";
import { Public } from "@auth/decorators/public.decorator";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Query(() => String, { name: GqlMutationNames.HealthCheck })
  healthCheck() {
    return "OK";
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, { name: GqlMutationNames.AdminLogin })
  adminLogin(@Args("input") input: AdminLoginInput, @Context() ctx: any) {
    return this.authService.adminLogin(input, ctx.req, ctx.res);
  }

  @Public()
  @Mutation(() => OtpResponseEntity, { name: GqlMutationNames.RequestOtp })
  requestOtp(@Args("input") input: RequestOtpInput) {
    return this.authService.requestOtp(input);
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, { name: GqlMutationNames.VerifyOtp })
  verifyOtp(@Args("input") input: VerifyOtpInput, @Context() ctx: any) {
    return this.authService.verifyOtp(input, ctx.req, ctx.res);
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, { name: GqlMutationNames.Refresh })
  refreshAuth(@Context() ctx: any) {
    return this.authService.refreshAuth(ctx.req, ctx.res);
  }

  @Public()
  @Mutation(() => LogoutResultEntity, { name: GqlMutationNames.Logout })
  logout(@Context() ctx: any) {
    return this.authService.logout(ctx.req, ctx.res);
  }

  @UseGuards(JwtAuthGuard)
  @AllowForcePasswordChange()
  @Mutation(() => LogoutResultEntity, { name: GqlMutationNames.LogoutAll })
  logoutAll(@CurrentUser() user: any, @Context() ctx: any) {
    return this.authService.logoutAll(ctx.req, ctx.res, user.id);
  }
}
