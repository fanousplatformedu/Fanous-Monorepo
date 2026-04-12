import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { UserStatus, OtpChannel, OtpPurpose } from "@prisma/client";
import { Role, SchoolStatus, SessionStatus } from "@prisma/client";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { setAuthCookies, clearAuthCookies } from "@auth/utils/auth.cookies";
import { randomBytes, createHash } from "crypto";
import { LogoutResultEntity } from "@auth/entities/logout-result.entity";
import { AuthPayloadEntity } from "@auth/entities/auth-payload.entity";
import { Request, Response } from "express";
import { OtpResponseEntity } from "@auth/entities/otp-response.entity";
import { AdminLoginInput } from "@auth/dtos/admin-login.input";
import { RequestOtpInput } from "@auth/dtos/request-otp.input";
import { VerifyOtpInput } from "@auth/dtos/verify-otp.input";
import { AuthErrorCode } from "@auth/enums/auth-error-code.enum";
import { PrismaService } from "@prisma/prisma.service";
import { AuthMessage } from "@auth/enums/auth-message.enum";
import { JwtService } from "@nestjs/jwt";

import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  private readonly accessSeconds = parseInt(
    process.env.JWT_ACCESS_TTL_SECONDS ?? "900",
    10,
  );

  private readonly refreshSeconds = parseInt(
    process.env.JWT_REFRESH_TTL_SECONDS ?? "2592000",
    10,
  );

  private readonly cookieDomain = process.env.COOKIE_DOMAIN || undefined;
  private readonly cookieSecure =
    (process.env.COOKIE_SECURE ?? "true") === "true";
  private readonly cookieSameSite =
    (process.env.COOKIE_SAMESITE as any) ?? "lax";

  private readonly adminRoles: Role[] = [Role.SCHOOL_ADMIN, Role.SUPER_ADMIN];

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ===================== Admin username/password =====================
  async adminLogin(
    input: AdminLoginInput,
    req: Request,
    res: Response,
  ): Promise<AuthPayloadEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { username: input.username },
      select: {
        id: true,
        role: true,
        status: true,
        passwordHash: true,
        fullName: true,
        schoolId: true,
        school: { select: { status: true } },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException({
        code: AuthErrorCode.INVALID_CREDENTIALS,
      });
    }

    if (!this.adminRoles.includes(user.role)) {
      throw new UnauthorizedException({
        code: AuthErrorCode.INVALID_CREDENTIALS,
      });
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException({ code: AuthErrorCode.USER_DISABLED });
    }

    if (user.role !== Role.SUPER_ADMIN) {
      if (!user.schoolId || user.school?.status !== SchoolStatus.ACTIVE) {
        throw new ForbiddenException({ code: AuthErrorCode.SCHOOL_SUSPENDED });
      }
    }

    const ok = await argon2.verify(user.passwordHash, input.password);
    if (!ok) {
      throw new UnauthorizedException({
        code: AuthErrorCode.INVALID_CREDENTIALS,
      });
    }

    await this.issueTokensAndSetCookies(
      user.id,
      user.role, // ✅ Role
      user.schoolId ?? null,
      req,
      res,
    );

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      message: AuthMessage.LOGGED_IN,
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId ?? undefined,
      fullName: user.fullName ?? undefined,
    };
  }

  // ===================== OTP Request =====================
  async requestOtp(input: RequestOtpInput): Promise<OtpResponseEntity> {
    const { destination, channel, schoolId } =
      await this.resolveDestinationAndTenant(input);

    const user = await this.findUserForOtp(destination, channel, schoolId);
    await this.ensureUserAndSchoolActive(user.id);

    const latest = await this.prismaService.otpCode.findFirst({
      where: { schoolId: user.schoolId!, destination, consumedAt: null },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    if (latest?.resendAfter && latest.resendAfter > now) {
      const diff = Math.ceil(
        (latest.resendAfter.getTime() - now.getTime()) / 1000,
      );
      throw new BadRequestException({
        code: AuthErrorCode.OTP_RESEND_COOLDOWN,
        resendAfterSeconds: diff,
      });
    }

    const code = this.generateOtpCode();
    const codeHash = await argon2.hash(code);

    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    const resendAfter = new Date(Date.now() + 60 * 1000);

    await this.prismaService.otpCode.create({
      data: {
        schoolId: user.schoolId!,
        userId: user.id,
        channel,
        purpose: OtpPurpose.LOGIN,
        destination,
        codeHash,
        expiresAt,
        resendAfter,
        maxAttempts: 5,
      },
    });

    console.log(`[DEV OTP] ${destination} => ${code}`);

    return { message: AuthMessage.OTP_SENT, resendAfterSeconds: 60 };
  }

  // ===================== OTP Verify =====================
  async verifyOtp(
    input: VerifyOtpInput,
    req: Request,
    res: Response,
  ): Promise<AuthPayloadEntity> {
    const { destination, channel, schoolId } =
      await this.resolveDestinationAndTenant(input);

    const user = await this.findUserForOtp(destination, channel, schoolId);
    await this.ensureUserAndSchoolActive(user.id);

    const otp = await this.prismaService.otpCode.findFirst({
      where: {
        schoolId: user.schoolId!,
        userId: user.id,
        destination,
        consumedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp)
      throw new UnauthorizedException({ code: AuthErrorCode.OTP_INVALID });
    if (otp.expiresAt < new Date())
      throw new UnauthorizedException({ code: AuthErrorCode.OTP_EXPIRED });
    if (otp.attempts >= otp.maxAttempts)
      throw new UnauthorizedException({
        code: AuthErrorCode.OTP_TOO_MANY_ATTEMPTS,
      });

    const ok = await argon2.verify(otp.codeHash, input.code);
    if (!ok) {
      await this.prismaService.otpCode.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException({ code: AuthErrorCode.OTP_INVALID });
    }

    await this.prismaService.otpCode.update({
      where: { id: otp.id },
      data: { consumedAt: new Date() },
    });

    await this.issueTokensAndSetCookies(
      user.id,
      user.role,
      user.schoolId!,
      req,
      res,
    );

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      message: AuthMessage.OTP_VERIFIED,
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId ?? undefined,
      fullName: user.fullName ?? undefined,
    };
  }

  // ===================== Refresh =====================
  async refreshAuth(req: Request, res: Response): Promise<AuthPayloadEntity> {
    const sid: string | undefined = req.cookies?.sid;
    const refreshToken: string | undefined = req.cookies?.refresh_token;

    if (!sid || !refreshToken) {
      throw new UnauthorizedException({
        code: AuthErrorCode.SESSION_NOT_FOUND,
      });
    }

    const session = await this.prismaService.authSession.findUnique({
      where: { sid },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            schoolId: true,
            status: true,
            school: { select: { status: true } },
          },
        },
      },
    });

    if (!session)
      throw new UnauthorizedException({
        code: AuthErrorCode.SESSION_NOT_FOUND,
      });

    if (
      session.status !== SessionStatus.ACTIVE ||
      session.expiresAt < new Date()
    ) {
      throw new UnauthorizedException({ code: AuthErrorCode.SESSION_REVOKED });
    }

    if (session.user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException({ code: AuthErrorCode.USER_DISABLED });
    }
    if (session.user.role !== Role.SUPER_ADMIN) {
      if (
        !session.user.schoolId ||
        session.user.school?.status !== SchoolStatus.ACTIVE
      ) {
        throw new ForbiddenException({ code: AuthErrorCode.SCHOOL_SUSPENDED });
      }
    }

    const refreshHash = this.sha256(refreshToken);
    if (refreshHash !== session.refreshTokenHash) {
      await this.prismaService.authSession.update({
        where: { sid },
        data: { status: SessionStatus.REVOKED, revokedAt: new Date() },
      });
      throw new UnauthorizedException({ code: AuthErrorCode.REFRESH_INVALID });
    }

    await this.prismaService.authSession.update({
      where: { sid },
      data: { status: SessionStatus.REVOKED, revokedAt: new Date() },
    });

    await this.issueTokensAndSetCookies(
      session.user.id,
      session.user.role,
      session.user.schoolId ?? null,
      req,
      res,
      sid,
    );

    return {
      message: AuthMessage.REFRESHED,
      userId: session.user.id,
      role: session.user.role,
      schoolId: session.user.schoolId ?? undefined,
    };
  }

  // ===================== Logout =====================
  async logout(req: Request, res: Response): Promise<LogoutResultEntity> {
    const sid: string | undefined = req.cookies?.sid;

    if (sid) {
      await this.prismaService.authSession.updateMany({
        where: { sid, status: SessionStatus.ACTIVE },
        data: { status: SessionStatus.REVOKED, revokedAt: new Date() },
      });
    }

    clearAuthCookies(res, {
      domain: this.cookieDomain,
      secure: this.cookieSecure,
      sameSite: this.cookieSameSite,
    });

    return { message: AuthMessage.LOGGED_OUT };
  }

  async logoutAll(
    req: Request,
    res: Response,
    userId: string,
  ): Promise<LogoutResultEntity> {
    await this.prismaService.authSession.updateMany({
      where: { userId, status: SessionStatus.ACTIVE },
      data: { status: SessionStatus.REVOKED, revokedAt: new Date() },
    });

    clearAuthCookies(res, {
      domain: this.cookieDomain,
      secure: this.cookieSecure,
      sameSite: this.cookieSameSite,
    });

    return { message: AuthMessage.LOGGED_OUT };
  }

  // ===================== Helpers =====================
  private async issueTokensAndSetCookies(
    userId: string,
    role: Role,
    schoolId: string | null,
    req: Request,
    res: Response,
    parentSid?: string,
  ) {
    const sid = this.randomToken(18);
    const refreshToken = this.randomToken(32);

    const accessToken = await this.jwtService.signAsync(
      { sub: userId, role, sid },
      {
        secret: process.env.JWT_ACCESS_SECRET!,
        expiresIn: this.accessSeconds,
      },
    );

    const refreshHash = this.sha256(refreshToken);

    await this.prismaService.authSession.create({
      data: {
        sid,
        parentSid: parentSid ?? null,
        userId,
        schoolId,
        status: SessionStatus.ACTIVE,
        refreshTokenHash: refreshHash,
        ip: (req.headers["x-forwarded-for"] as string) || req.ip,
        userAgent: req.headers["user-agent"] ?? null,
        expiresAt: new Date(Date.now() + this.refreshSeconds * 1000),
      },
    });

    setAuthCookies(
      res,
      { accessToken, refreshToken, sid },
      {
        domain: this.cookieDomain,
        secure: this.cookieSecure,
        sameSite: this.cookieSameSite,
      },
      {
        accessSeconds: this.accessSeconds,
        refreshSeconds: this.refreshSeconds,
      },
    );
  }

  private async resolveDestinationAndTenant(input: {
    email?: string;
    mobile?: string;
    schoolCode?: string;
  }): Promise<{
    destination: string;
    channel: OtpChannel;
    schoolId: string | null;
  }> {
    const hasEmail = !!input.email;
    const hasMobile = !!input.mobile;

    if ((hasEmail && hasMobile) || (!hasEmail && !hasMobile)) {
      throw new BadRequestException("Provide either email or mobile");
    }

    const channel: OtpChannel = hasEmail ? OtpChannel.EMAIL : OtpChannel.SMS;

    const destination = hasEmail
      ? this.normalizeEmail(input.email!)
      : this.normalizeMobile(input.mobile!);

    if (input.schoolCode) {
      const school = await this.prismaService.school.findFirst({
        where: { code: input.schoolCode },
        select: { id: true },
      });

      if (!school) {
        throw new BadRequestException({ code: AuthErrorCode.TENANT_NOT_FOUND });
      }

      return { destination, channel, schoolId: school.id };
    }

    return { destination, channel, schoolId: null };
  }

  private async findUserForOtp(
    destination: string,
    channel: OtpChannel,
    schoolId: string | null,
  ) {
    const whereBase =
      channel === OtpChannel.EMAIL
        ? { email: destination }
        : { mobile: destination };

    const select = {
      id: true,
      role: true,
      schoolId: true,
      status: true,
      fullName: true,
    };

    if (schoolId) {
      const user = await this.prismaService.user.findFirst({
        where: { ...whereBase, schoolId, status: UserStatus.ACTIVE },
        select,
      });

      if (!user) {
        throw new UnauthorizedException({
          code: AuthErrorCode.ACCESS_NOT_APPROVED,
        });
      }
      return user;
    }

    const users = await this.prismaService.user.findMany({
      where: { ...whereBase, status: UserStatus.ACTIVE },
      select,
      take: 2,
    });

    if (users.length === 0) {
      throw new UnauthorizedException({
        code: AuthErrorCode.ACCESS_NOT_APPROVED,
      });
    }
    if (users.length > 1) {
      throw new BadRequestException({ code: AuthErrorCode.AMBIGUOUS_TENANT });
    }
    return users[0];
  }

  private async ensureUserAndSchoolActive(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        status: true,
        schoolId: true,
        school: { select: { status: true } },
      },
    });

    if (!user)
      throw new UnauthorizedException({
        code: AuthErrorCode.INVALID_CREDENTIALS,
      });
    if (user.status !== UserStatus.ACTIVE)
      throw new ForbiddenException({ code: AuthErrorCode.USER_DISABLED });

    if (user.role !== Role.SUPER_ADMIN) {
      if (!user.schoolId || user.school?.status !== SchoolStatus.ACTIVE) {
        throw new ForbiddenException({ code: AuthErrorCode.SCHOOL_SUSPENDED });
      }
    }
  }

  private generateOtpCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private normalizeMobile(mobile: string) {
    return mobile.trim();
  }

  private randomToken(bytes: number) {
    return randomBytes(bytes).toString("hex");
  }

  private sha256(input: string) {
    return createHash("sha256").update(input).digest("hex");
  }
}
