import { ForbiddenException, Injectable } from "@nestjs/common";
import { OtpChannel, OtpPurpose } from "@prisma/client";
import { UnauthorizedException } from "@nestjs/common";
import { isEmail, isPhone } from "@utils/function-helper";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@prisma/prisma.service";
import { AuthCodes } from "@auth/enums/auth-errors.enum";
import { nanoid } from "nanoid";

import * as argon2 from "argon2";

@Injectable()
export class OtpService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  private otpTTLSeconds() {
    return Number(this.configService.get("OTP_TTL_SECONDS") ?? 120);
  }
  private resendCooldownSeconds() {
    return Number(this.configService.get("OTP_RESEND_COOLDOWN_SECONDS") ?? 60);
  }
  private maxPerHour() {
    return Number(this.configService.get("OTP_MAX_PER_HOUR") ?? 5);
  }
  private maxVerifyAttempts() {
    return Number(this.configService.get("OTP_MAX_VERIFY_ATTEMPTS") ?? 5);
  }

  private normalizeIdentifier(identifier: string) {
    const v = identifier.trim();
    if (isEmail(v))
      return { channel: OtpChannel.EMAIL, email: v.toLowerCase(), phone: null };
    const p = v.replace(/\s/g, "");
    if (isPhone(p)) return { channel: OtpChannel.SMS, email: null, phone: p };
    throw new ForbiddenException(AuthCodes.IDENTIFIER_INVALID);
  }

  private async ensureRateLimit(schoolId: string, identifier: string) {
    const { email, phone } = this.normalizeIdentifier(identifier);
    const since = new Date(Date.now() - 60 * 60 * 1000);

    const count = await this.prismaService.otpRequest.count({
      where: {
        schoolId,
        purpose: OtpPurpose.LOGIN,
        createdAt: { gte: since },
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
      },
    });
    if (count >= this.maxPerHour()) {
      throw new ForbiddenException(AuthCodes.OTP_RATE_LIMIT);
    }

    const last = await this.prismaService.otpRequest.findFirst({
      where: {
        schoolId,
        purpose: OtpPurpose.LOGIN,
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
      },
      orderBy: { createdAt: "desc" },
      select: { resendAfter: true },
    });
    if (last?.resendAfter && last.resendAfter > new Date())
      throw new ForbiddenException(AuthCodes.OTP_RESEND_COOLDOWN);
  }

  async createLoginOtp(params: {
    schoolId: string;
    userId: string;
    identifier: string;
  }) {
    const { schoolId, userId, identifier } = params;
    await this.ensureRateLimit(schoolId, identifier);
    const { channel, email, phone } = this.normalizeIdentifier(identifier);
    const code = nanoid(8).replace(/[-_]/g, "7").slice(0, 6);
    const codeHash = await argon2.hash(code);
    const now = Date.now();
    const expiresAt = new Date(now + this.otpTTLSeconds() * 1000);
    const resendAfter = new Date(now + this.resendCooldownSeconds() * 1000);
    await this.prismaService.otpRequest.create({
      data: {
        schoolId,
        userId,
        purpose: OtpPurpose.LOGIN,
        channel,
        email: email ?? undefined,
        phone: phone ?? undefined,
        codeHash,
        expiresAt,
        resendAfter,
      },
    });
    if (process.env.NODE_ENV !== "production")
      console.log("[DEV OTP]", { schoolId, userId, identifier, code });
    return { resendAfter, devCode: code };
  }

  async verifyLoginOtp(params: {
    schoolId: string;
    identifier: string;
    code: string;
  }) {
    const { schoolId, identifier, code } = params;
    const { email, phone } = this.normalizeIdentifier(identifier);

    const otp = await this.prismaService.otpRequest.findFirst({
      where: {
        schoolId,
        purpose: OtpPurpose.LOGIN,
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) throw new UnauthorizedException(AuthCodes.OTP_NOT_FOUND);
    if (otp.usedAt) throw new UnauthorizedException(AuthCodes.OTP_ALREADY_USED);
    if (otp.expiresAt < new Date())
      throw new UnauthorizedException(AuthCodes.OTP_EXPIRED);
    if (otp.attempts >= this.maxVerifyAttempts())
      throw new UnauthorizedException(AuthCodes.OTP_TOO_MANY_ATTEMPTS);
    const ok = await argon2.verify(otp.codeHash, code);
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
