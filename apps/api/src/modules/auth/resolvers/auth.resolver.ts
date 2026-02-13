import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthPayloadEntity } from "@auth/entities/auth-entity";
import { RequestOtpInput } from "@auth/dto/request-otp.input";
import { VerifyOtpInput } from "@auth/dto/verify-otp.input";
import { AuthService } from "@auth/services/auth.service";
import { QueryNames } from "@enums/gql-names.enum";
import { Public } from "@decorators/public.decorator";

@Resolver(() => AuthPayloadEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => Boolean, { name: QueryNames.REQUEST_OTP })
  async requestOtp(@Args("input") input: RequestOtpInput): Promise<boolean> {
    await this.authService.requestOtp(input);
    return true;
  }

  @Public()
  @Mutation(() => AuthPayloadEntity, { name: QueryNames.VERIFY_OTP })
  async verifyOtp(
    @Args("input") input: VerifyOtpInput,
  ): Promise<AuthPayloadEntity> {
    return this.authService.verifyOtp(input);
  }
}
