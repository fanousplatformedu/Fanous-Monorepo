import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ApprovalStatus, OtpChannel, Role } from "@prisma/client";
import { hash, verify as verifyHash } from "argon2";
import { AuthRegisterRequestInput } from "@auth/dto/register-request.input";
import { AuthRegisterStatusEntity } from "@auth/entities/register-status.entity";
import { randomBytes, createHash } from "crypto";
import { normalizeIdentifier } from "@utils/identifier";
import { AuthRequestOtpInput } from "@auth/dto/request-otp.input";
import { AuthVerifyOtpInput } from "@auth/dto/verify-otp.input";
import { AuthPayloadEntity } from "@auth/entities/auth-payload.entity";
import { AuthErrorEnum } from "@auth/enum/auth.message.enum";
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

  private readonly ACCESS_EXPIRES = "15m";
  private readonly REFRESH_DAYS = 30;
  private readonly REFRESH_PEPPER =
    process.env.REFRESH_TOKEN_PEPPER || "dev_pepper_change_me";

  private readonly ALLOWED_REGISTER_ROLES = new Set<Role>([
    Role.STUDENT,
    Role.PARENT,
    Role.TEACHER,
    Role.COUNSELOR,
  ]);

  private throw429(message: string, retryAfterSeconds?: number): never {
    throw new HttpException(
      { message, ...(retryAfterSeconds ? { retryAfterSeconds } : {}) },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  private hashRefreshToken(token: string) {
    return createHash("sha256")
      .update(`${this.REFRESH_PEPPER}:${token}`)
      .digest("hex");
  }

  async registerRequest(
    input: AuthRegisterRequestInput,
  ): Promise<AuthRegisterStatusEntity> {
    if (!this.ALLOWED_REGISTER_ROLES.has(input.desiredRole))
      throw new BadRequestException(AuthErrorEnum.ROLE_NOT_ALLOWED);
    const channel = input.channel;
    const identifier = normalizeIdentifier(channel, input.identifier);
    const schoolId = input.tenantId;
    if (!schoolId) throw new BadRequestException(AuthErrorEnum.SCHOOL_REQUIRED);
    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
      select: { id: true, isActive: true },
    });
    if (!school || !school.isActive)
      throw new BadRequestException(AuthErrorEnum.SCHOOL_NOT_FOUND);
    const user =
      channel === OtpChannel.EMAIL
        ? await this.prismaService.user.upsert({
            where: { email: identifier },
            create: {
              email: identifier,
              emailVerified: false,
              phone: null,
              phoneVerified: false,
              role: Role.PENDING,
              desiredRole: input.desiredRole,
              name: input.name ?? null,
              schoolId,
            },
            update: {
              desiredRole: input.desiredRole,
              ...(input.name ? { name: input.name } : {}),
              schoolId,
            },
          })
        : await this.prismaService.user.upsert({
            where: { phone: identifier },
            create: {
              email: null,
              phone: identifier,
              role: Role.PENDING,
              phoneVerified: false,
              emailVerified: false,
              name: input.name ?? null,
              desiredRole: input.desiredRole,
              schoolId,
            },
            update: {
              desiredRole: input.desiredRole,
              ...(input.name ? { name: input.name } : {}),
              schoolId,
            },
          });
    const existingPending =
      await this.prismaService.roleApprovalRequest.findFirst({
        where: {
          userId: user.id,
          schoolId,
          status: ApprovalStatus.PENDING,
        },
        select: { id: true },
      });

    if (!existingPending) {
      await this.prismaService.roleApprovalRequest.create({
        data: {
          userId: user.id,
          requestedRole: input.desiredRole,
          status: ApprovalStatus.PENDING,
          schoolId,
          note: null,
        },
      });
    }
    await this.requestOtp({
      channel,
      identifier: input.identifier,
      tenantId: schoolId,
    });
    return { ok: true, userId: user.id, desiredRole: input.desiredRole };
  }

  async requestOtp(input: AuthRequestOtpInput): Promise<void> {
    const channel = input.channel;
    const identifier = normalizeIdentifier(channel, input.identifier);
    const tenantId = input.tenantId ?? null;
    const now = new Date();

    const activeOtp = await this.prismaService.otpToken.findFirst({
      where: {
        identifier,
        channel,
        tenantId,
        verifiedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    });

    if (activeOtp) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((activeOtp.expiresAt.getTime() - now.getTime()) / 1000),
      );
      this.throw429(AuthErrorEnum.OTP_COOLDOWN_ACTIVE, retryAfterSeconds);
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const countLastHour = await this.prismaService.otpToken.count({
      where: { identifier, channel, tenantId, createdAt: { gt: oneHourAgo } },
    });
    if (countLastHour >= this.OTP_RATE_LIMIT_PER_HOUR)
      this.throw429(AuthErrorEnum.TOO_MANY_REQUESTS, 3600);

    const code = this.generateNumericCode(6);
    const codeHash = await hash(code);
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRES_SEC * 1000);

    await this.prismaService.otpToken.create({
      data: { identifier, channel, codeHash, tenantId, expiresAt },
    });

    console.log(
      `[OTP][DEV] ${channel}=${identifier} code=${code} exp=${this.OTP_EXPIRES_SEC}s`,
    );
  }

  async verifyOtp(input: AuthVerifyOtpInput): Promise<AuthPayloadEntity> {
    const channel = input.channel;
    const identifier = normalizeIdentifier(channel, input.identifier);
    const schoolId = input.tenantId ?? null;
    const now = new Date();
    const otp = await this.prismaService.otpToken.findFirst({
      where: {
        identifier,
        channel,
        tenantId: schoolId,
        verifiedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!otp) throw new UnauthorizedException(AuthErrorEnum.OTP_NOT_FOUND);
    const ok = await verifyHash(otp.codeHash, input.code);
    if (!ok) throw new UnauthorizedException(AuthErrorEnum.INVALID_OTP);
    await this.prismaService.otpToken.update({
      where: { id: otp.id },
      data: { verifiedAt: now },
    });

    const user = await this.prismaService.user.findFirst({
      where:
        channel === OtpChannel.EMAIL
          ? { email: identifier }
          : { phone: identifier },
      select: {
        id: true,
        role: true,
        isActive: true,
        schoolId: true,
        emailVerified: true,
        phoneVerified: true,
      },
    });
    if (!user) throw new UnauthorizedException(AuthErrorEnum.UNAUTHORIZED);
    if (!user.isActive)
      throw new UnauthorizedException(AuthErrorEnum.USER_INACTIVE);
    await this.prismaService.user.update({
      where: { id: user.id },
      data:
        channel === OtpChannel.EMAIL
          ? { emailVerified: true }
          : { phoneVerified: true },
    });
    if (user.role === Role.PENDING)
      throw new UnauthorizedException(AuthErrorEnum.ROLE_NOT_APPROVED);
    return this.issueTokens(user.id);
  }

  async refresh(refreshTokenPlain: string): Promise<AuthPayloadEntity> {
    const now = new Date();
    const tokenHash = this.hashRefreshToken(refreshTokenPlain);

    const token = await this.prismaService.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      select: { id: true, userId: true },
    });

    if (!token)
      throw new UnauthorizedException(AuthErrorEnum.INVALID_REFRESH_TOKEN);

    await this.prismaService.refreshToken.update({
      where: { id: token.id },
      data: { revokedAt: now },
    });
    return this.issueTokens(token.userId);
  }

  async logout(refreshTokenPlain: string): Promise<void> {
    const tokenHash = this.hashRefreshToken(refreshTokenPlain);
    await this.prismaService.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private generateNumericCode(len = 6): string {
    const max = 10 ** len;
    const n = Math.floor(Math.random() * max);
    return String(n).padStart(len, "0");
  }

  private async issueTokens(userId: string): Promise<AuthPayloadEntity> {
    const u = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        name: true,
        avatar: true,
        isActive: true,
      },
    });

    if (!u || !u.isActive)
      throw new UnauthorizedException(AuthErrorEnum.UNAUTHORIZED);

    const accessToken = await this.jwtService.signAsync(
      { sub: u.id, role: u.role },
      { expiresIn: this.ACCESS_EXPIRES },
    );

    const refreshPlain = randomBytes(48).toString("hex");
    const refreshHash = this.hashRefreshToken(refreshPlain);
    const expiresAt = new Date(
      Date.now() + this.REFRESH_DAYS * 24 * 60 * 60 * 1000,
    );

    await this.prismaService.refreshToken.create({
      data: { userId: u.id, tokenHash: refreshHash, expiresAt },
    });

    return {
      accessToken,
      id: u.id,
      role: u.role,
      name: u.name ?? undefined,
      refreshToken: refreshPlain,
      avatar: u.avatar ?? undefined,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException(AuthErrorEnum.UNAUTHORIZED);
    return user;
  }
}
