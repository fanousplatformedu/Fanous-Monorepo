import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { BadRequestException, HttpException } from "@nestjs/common";
import { hash, verify as verifyHash } from "argon2";
import { normalizeIranMobile } from "@utils/phoneGenerate";
import { OtpChannel, Role } from "@prisma/client";
import { AuthMessageEnum } from "@auth/enum/auth.message.enum";
import { RequestOtpInput } from "@auth/dto/request-otp.input";
import { VerifyOtpInput } from "@auth/dto/verify-otp.input";
import { PrismaService } from "@prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private readonly OTP_EXPIRES_SEC = 120; // 2min
  private readonly OTP_RATE_LIMIT_PER_HOUR = 5;

  private generateNumericCode(len = 6): string {
    const n = Math.floor(Math.random() * 1_000_000);
    return String(n).padStart(len, "0");
  }

  private normalizeIdentifier(channel: OtpChannel, identifier: string): string {
    if (channel === OtpChannel.EMAIL) {
      const email = identifier.trim().toLowerCase();
      return email;
    }

    const norm = normalizeIranMobile(identifier);
    if (!norm.ok) throw new BadRequestException(AuthMessageEnum.INVALID_MOBILE);
    return norm.e164!;
  }

  async requestOtp(input: RequestOtpInput): Promise<void> {
    const channel = input.channel;
    const identifier = this.normalizeIdentifier(channel, input.identifier);
    const tenantId = input.tenantId ?? null;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const countLastHour = await this.prisma.otpToken.count({
      where: {
        identifier,
        channel,
        tenantId,
        createdAt: { gt: oneHourAgo },
      },
    });

    if (countLastHour >= this.OTP_RATE_LIMIT_PER_HOUR)
      throw new HttpException(
        AuthMessageEnum.TOO_MANY_REQUESTS,
        HttpStatus.TOO_MANY_REQUESTS,
      );

    const code = this.generateNumericCode(6);
    const codeHash = await hash(code);
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRES_SEC * 1000);

    await this.prisma.otpToken.create({
      data: {
        identifier,
        channel,
        codeHash,
        tenantId,
        expiresAt,
      },
    });

    // TODO: ارسال SMS/Email واقعی
    console.log(
      `[OTP][DEV] ${channel}=${identifier} code=${code} exp=${this.OTP_EXPIRES_SEC}s`,
    );
  }

  async verifyOtp(input: VerifyOtpInput) {
    const channel = input.channel;
    const identifier = this.normalizeIdentifier(channel, input.identifier);
    const tenantId = input.tenantId ?? null;
    const now = new Date();

    const lastOtp = await this.prisma.otpToken.findFirst({
      where: {
        identifier,
        channel,
        tenantId,
        verifiedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!lastOtp)
      throw new UnauthorizedException(AuthMessageEnum.OTP_NOT_FOUND);
    if (lastOtp.expiresAt < now)
      throw new UnauthorizedException(AuthMessageEnum.OTP_EXPIRED);

    const ok = await verifyHash(lastOtp.codeHash, input.code);
    if (!ok) throw new UnauthorizedException(AuthMessageEnum.INVALID_OTP);

    await this.prisma.otpToken.update({
      where: { id: lastOtp.id },
      data: { verifiedAt: now },
    });

    const where =
      channel === OtpChannel.EMAIL
        ? { email: identifier }
        : { phone: identifier };

    let user = await this.prisma.user.findFirst({ where });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          role: Role.STUDENT,
          email: channel === OtpChannel.EMAIL ? identifier : null,
          phone: channel === OtpChannel.PHONE ? identifier : null,
          password: null,
          name: null,
          emailVerified: channel === OtpChannel.EMAIL,
          phoneVerified: channel === OtpChannel.PHONE,
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified:
            channel === OtpChannel.EMAIL ? true : user.emailVerified,
          phoneVerified:
            channel === OtpChannel.PHONE ? true : user.phoneVerified,
        },
      });
    }

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
    });

    return {
      accessToken,
      id: user.id,
      role: user.role,
      name: user.name ?? undefined,
      avatar: user.avatar ?? undefined,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      throw new UnauthorizedException(AuthMessageEnum.INVALID_CREDENTIALS);
    if (!user.isActive)
      throw new UnauthorizedException(AuthMessageEnum.UNAUTHORIZED);
    return user;
  }
}
