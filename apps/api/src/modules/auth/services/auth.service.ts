import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { BadRequestException, HttpException } from "@nestjs/common";
import { OtpChannel, Role, TenantRole } from "@prisma/client";
import { hash, verify as verifyHash } from "argon2";
import { normalizeIranMobile } from "@utils/phoneGenerate";
import { AuthPayloadEntity } from "@auth/entities/auth-entity";
import { RequestOtpInput } from "@auth/dto/request-otp.input";
import { AuthMessageEnum } from "@auth/enum/auth.message.enum";
import { VerifyOtpInput } from "@auth/dto/verify-otp.input";
import { PrismaService } from "@prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly OTP_EXPIRES_SEC = 120;
  private readonly OTP_RATE_LIMIT_PER_HOUR = 5;

  private generateNumericCode(len = 6): string {
    const max = 10 ** len;
    const n = Math.floor(Math.random() * max);
    return String(n).padStart(len, "0");
  }

  private normalizeIdentifier(channel: OtpChannel, identifier: string): string {
    if (channel === OtpChannel.EMAIL) return identifier.trim().toLowerCase();
    const norm = normalizeIranMobile(identifier);
    if (!norm.ok) throw new BadRequestException(AuthMessageEnum.INVALID_MOBILE);
    return norm.e164!;
  }

  async requestOtp(input: RequestOtpInput): Promise<void> {
    const channel = input.channel;
    const identifier = this.normalizeIdentifier(channel, input.identifier);
    const tenantId = input.tenantId ?? null;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const countLastHour = await this.prismaService.otpToken.count({
      where: {
        identifier,
        channel,
        tenantId,
        createdAt: { gt: oneHourAgo },
      },
    });

    if (countLastHour >= this.OTP_RATE_LIMIT_PER_HOUR) {
      throw new HttpException(
        AuthMessageEnum.TOO_MANY_REQUESTS,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = this.generateNumericCode(6);
    const codeHash = await hash(code);
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRES_SEC * 1000);

    await this.prismaService.otpToken.create({
      data: { identifier, channel, codeHash, tenantId, expiresAt },
    });

    // TODO: replace with provider integrations (SMS/Email)
    console.log(
      `[OTP][DEV] ${channel}=${identifier} code=${code} exp=${this.OTP_EXPIRES_SEC}s`,
    );
  }

  async verifyOtp(input: VerifyOtpInput): Promise<AuthPayloadEntity> {
    const channel = input.channel;
    const identifier = this.normalizeIdentifier(channel, input.identifier);
    const tenantId = input.tenantId ?? null;
    const now = new Date();

    const lastOtp = await this.prismaService.otpToken.findFirst({
      where: { identifier, channel, tenantId, verifiedAt: null },
      orderBy: { createdAt: "desc" },
    });

    if (!lastOtp)
      throw new UnauthorizedException(AuthMessageEnum.OTP_NOT_FOUND);
    if (lastOtp.expiresAt < now)
      throw new UnauthorizedException(AuthMessageEnum.OTP_EXPIRED);

    const ok = await verifyHash(lastOtp.codeHash, input.code);
    if (!ok) throw new UnauthorizedException(AuthMessageEnum.INVALID_OTP);

    await this.prismaService.otpToken.update({
      where: { id: lastOtp.id },
      data: { verifiedAt: now },
    });

    const user =
      channel === OtpChannel.EMAIL
        ? await this.prismaService.user.upsert({
            where: { email: identifier },
            create: {
              role: Role.STUDENT,
              email: identifier,
              emailVerified: true,
              phone: null,
              phoneVerified: false,
              name: null,
              password: null,
            },
            update: { emailVerified: true },
          })
        : await this.prismaService.user.upsert({
            where: { phone: identifier },
            create: {
              role: Role.STUDENT,
              phone: identifier,
              phoneVerified: true,
              email: null,
              emailVerified: false,
              name: null,
              password: null,
            },
            update: { phoneVerified: true },
          });

    if (tenantId) {
      await this.prismaService.userTenantRole.upsert({
        where: {
          userId_tenantId_role: {
            userId: user.id,
            tenantId,
            role: TenantRole.STUDENT,
          },
        },
        create: {
          userId: user.id,
          tenantId,
          role: TenantRole.STUDENT,
        },
        update: {},
      });
    }

    const accessToken = await this.jwtService.signAsync({
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
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user)
      throw new UnauthorizedException(AuthMessageEnum.INVALID_CREDENTIALS);
    if (!user.isActive)
      throw new UnauthorizedException(AuthMessageEnum.UNAUTHORIZED);
    return user;
  }
}
