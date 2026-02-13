import { BadRequestException } from "@nestjs/common";
import { normalizeIranMobile } from "@utils/phoneGenerate";
import { AuthErrorEnum } from "@auth/enum/auth.message.enum";
import { OtpChannel } from "@prisma/client";

export const normalizeIdentifier = (
  channel: OtpChannel,
  identifier: string,
): string => {
  if (channel === OtpChannel.EMAIL) {
    const email = identifier.trim().toLowerCase();
    if (!email.includes("@"))
      throw new BadRequestException(AuthErrorEnum.INVALID_EMAIL);
    return email;
  }
  const norm = normalizeIranMobile(identifier);
  if (!norm.ok) throw new BadRequestException(AuthErrorEnum.INVALID_MOBILE);
  return norm.e164!;
};
