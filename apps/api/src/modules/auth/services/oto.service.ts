import { ForbiddenException, Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@prisma/prisma.service";
import { AuthCodes } from "@auth/enums/auth-errors.enum";

import * as argon2 from "argon2";
import * as T from "@auth/types/otp-service.type";
import * as H from "@utils/otp-helper";

@Injectable()
export class OtpService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async ensureRateLimit(input: T.TOtpEnsureRateLimitInput): Promise<void> {
    const { schoolId, purpose, identifier } = input;
    const { emailNormalized, phoneNormalized } =
      H.normalizeIdentifier(identifier);
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const count = await this.prismaService.otpRequest.count({
      where: {
        ...H.buildOtpWhere({
          schoolId,
          purpose,
          emailNormalized,
          phoneNormalized,
        }),
        createdAt: { gte: since },
      },
    });

    if (count >= H.maxPerHour(this.configService))
      throw new ForbiddenException(AuthCodes.OTP_RATE_LIMIT);
    const last = await this.prismaService.otpRequest.findFirst({
      where: H.buildOtpWhere({
        schoolId,
        purpose,
        emailNormalized,
        phoneNormalized,
      }),
      orderBy: { createdAt: "desc" },
      select: { resendAfter: true },
    });
    if (last?.resendAfter && last.resendAfter > new Date())
      throw new ForbiddenException(AuthCodes.OTP_RESEND_COOLDOWN);
  }

  async createLoginOtp(
    input: T.TOtpCreateLoginInput,
  ): Promise<T.TOtpCreateLoginOutput> {
    await this.ensureRateLimit({
      schoolId: input.schoolId,
      purpose: input.purpose,
      identifier: input.identifier,
    });

    const { channel, email, phone, emailNormalized, phoneNormalized } =
      H.normalizeIdentifier(input.identifier);
    const code = H.generateOtpCode();
    const codeHash = await argon2.hash(code);
    const expiresAt = H.nowPlusSeconds(H.otpTTLSeconds(this.configService));
    const resendAfter = H.nowPlusSeconds(
      H.resendCooldownSeconds(this.configService),
    );

    await this.prismaService.otpRequest.create({
      data: {
        schoolId: input.schoolId,
        userId: input.userId,
        purpose: input.purpose,
        channel,
        email: email ?? undefined,
        phone: phone ?? undefined,
        emailNormalized: emailNormalized ?? undefined,
        phoneNormalized: phoneNormalized ?? undefined,
        codeHash,
        expiresAt,
        resendAfter,
        ip: input.ip,
        userAgent: input.userAgent,
      },
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("[DEV OTP]", {
        schoolId: input.schoolId,
        userId: input.userId,
        purpose: input.purpose,
        identifier: input.identifier,
        code,
      });
    }

    return { resendAfter, devCode: code };
  }

  async verifyLoginOtp(
    input: T.TOtpVerifyLoginInput,
  ): Promise<T.TOtpVerifyLoginOutput> {
    const { emailNormalized, phoneNormalized } = H.normalizeIdentifier(
      input.identifier,
    );

    const otp = await this.prismaService.otpRequest.findFirst({
      where: H.buildOtpWhere({
        schoolId: input.schoolId,
        purpose: input.purpose,
        emailNormalized,
        phoneNormalized,
      }),
      orderBy: { createdAt: "desc" },
    });
    if (!otp) throw new UnauthorizedException(AuthCodes.OTP_NOT_FOUND);
    if (otp.usedAt) throw new UnauthorizedException(AuthCodes.OTP_ALREADY_USED);
    if (otp.expiresAt < new Date())
      throw new UnauthorizedException(AuthCodes.OTP_EXPIRED);
    if (otp.attempts >= H.maxVerifyAttempts(this.configService))
      throw new UnauthorizedException(AuthCodes.OTP_TOO_MANY_ATTEMPTS);
    const ok = await argon2.verify(otp.codeHash, input.code);
    if (!ok) {
      await this.prismaService.otpRequest.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException(AuthCodes.OTP_INVALID);
    }
    await this.prismaService.otpRequest.update({
      where: { id: otp.id },
      data: { usedAt: new Date() },
    });
    if (!otp.userId) throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    return { userId: otp.userId };
  }
}
