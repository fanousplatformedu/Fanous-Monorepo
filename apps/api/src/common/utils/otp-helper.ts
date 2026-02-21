import { TNormalizedIdentifier } from "@auth/types/otp-service.type";
import { ForbiddenException } from "@nestjs/common";
import { isEmail, isPhone } from "@utils/guard-helper";
import { ConfigService } from "@nestjs/config";
import { OtpChannel } from "@prisma/client";
import { AuthCodes } from "@auth/enums/auth-errors.enum";
import { nanoid } from "nanoid";

export const otpTTLSeconds = (configService: ConfigService): number =>
  Number(configService.get("OTP_TTL_SECONDS") ?? 120);

export const resendCooldownSeconds = (configService: ConfigService): number =>
  Number(configService.get("OTP_RESEND_COOLDOWN_SECONDS") ?? 60);

export const maxPerHour = (configService: ConfigService): number =>
  Number(configService.get("OTP_MAX_PER_HOUR") ?? 5);

export const maxVerifyAttempts = (configService: ConfigService): number =>
  Number(configService.get("OTP_MAX_VERIFY_ATTEMPTS") ?? 5);

export const normalizeIdentifier = (
  identifier: string,
): TNormalizedIdentifier => {
  const v = identifier.trim();
  if (isEmail(v)) {
    const emailN = v.toLowerCase();
    return {
      channel: OtpChannel.EMAIL,
      email: v,
      phone: null,
      emailNormalized: emailN,
      phoneNormalized: null,
    };
  }
  const p = v.replace(/\s/g, "");
  if (isPhone(p)) {
    return {
      channel: OtpChannel.SMS,
      email: null,
      phone: p,
      emailNormalized: null,
      phoneNormalized: p,
    };
  }
  throw new ForbiddenException(AuthCodes.IDENTIFIER_INVALID);
};

export const buildOtpWhere = (params: {
  schoolId: string;
  purpose: any;
  emailNormalized: string | null;
  phoneNormalized: string | null;
}) => {
  const { schoolId, purpose, emailNormalized, phoneNormalized } = params;

  return {
    schoolId,
    purpose,
    ...(emailNormalized ? { emailNormalized } : {}),
    ...(phoneNormalized ? { phoneNormalized } : {}),
  };
};

export const nowPlusSeconds = (seconds: number): Date =>
  new Date(Date.now() + seconds * 1000);

export const generateOtpCode = (): string =>
  nanoid(8).replace(/[-_]/g, "7").slice(0, 6);
