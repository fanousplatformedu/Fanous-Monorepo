import { MembershipStatus, TokenType, GlobalRole } from "@prisma/client";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { parseAccessTtlToSeconds } from "@utils/function-helper";
import { UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { OtpService } from "@auth/services/oto.service";
import { JwtPayload } from "@auth/types/jwt-payload.type";
import { AuthCodes } from "@auth/enums/auth-errors.enum";
import { nanoid } from "nanoid";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  // ============= cookie helpers ============
  private isProd() {
    return (
      (this.configService.get("NODE_ENV") ?? process.env.NODE_ENV) ===
      "production"
    );
  }

  private cookieCommon() {
    return {
      httpOnly: true,
      secure: this.isProd(),
      sameSite: "lax" as const,
      path: "/",
    };
  }

  private cookieAccessOptions() {
    return {
      ...this.cookieCommon(),
      maxAge: parseAccessTtlToSeconds(this.accessTtl()),
    };
  }

  private cookieRefreshOptions() {
    return {
      ...this.cookieCommon(),
      maxAge: this.refreshDays() * 24 * 60 * 60,
    };
  }

  getCookie(req: any, name: string) {
    const v = req?.cookies?.[name];
    if (!v || typeof v !== "string") {
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    }
    return v;
  }

  setSchoolAuthCookies(
    res: any,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie("sk_at", tokens.accessToken, this.cookieAccessOptions());
    res.cookie("sk_rt", tokens.refreshToken, this.cookieRefreshOptions());
  }

  clearSchoolAuthCookies(res: any) {
    res.clearCookie("sk_at", { path: "/" });
    res.clearCookie("sk_rt", { path: "/" });
  }

  setSuperAdminAuthCookies(
    res: any,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie("sa_at", tokens.accessToken, this.cookieAccessOptions());
    res.cookie("sa_rt", tokens.refreshToken, this.cookieRefreshOptions());
  }

  clearSuperAdminAuthCookies(res: any) {
    res.clearCookie("sa_at", { path: "/" });
    res.clearCookie("sa_rt", { path: "/" });
  }

  private accessTtl() {
    return this.configService.get<string>("ACCESS_TOKEN_TTL") ?? "15m";
  }

  private refreshDays() {
    return Number(this.configService.get("REFRESH_TOKEN_TTL_DAYS") ?? 30);
  }

  private refreshExpiryDate() {
    const days = this.refreshDays();
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private sha256(input: string) {
    const crypto = require("crypto") as typeof import("crypto");
    return crypto.createHash("sha256").update(input).digest("hex");
  }

  // ============ A) SCHOOL LOGIN ===============
  async requestLoginOtp(schoolId: string, identifier: string) {
    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
    });
    if (!school) throw new ForbiddenException(AuthCodes.SCHOOL_NOT_FOUND);
    if (!school.isActive)
      throw new ForbiddenException(AuthCodes.SCHOOL_INACTIVE);
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: identifier.trim().toLowerCase() },
          { phone: identifier.trim().replace(/\s/g, "") },
        ],
      },
    });
    if (!user) throw new ForbiddenException(AuthCodes.USER_NOT_FOUND);
    if (user.globalRole === GlobalRole.SUPER_ADMIN)
      throw new ForbiddenException(AuthCodes.SUPER_ADMIN_ONLY);
    const membership = await this.prismaService.userSchoolMembership.findFirst({
      where: { userId: user.id, schoolId, status: MembershipStatus.APPROVED },
    });
    if (!membership) {
      const any = await this.prismaService.userSchoolMembership.findFirst({
        where: { userId: user.id, schoolId },
      });
      if (!any) throw new ForbiddenException(AuthCodes.MEMBERSHIP_NOT_FOUND);
      throw new ForbiddenException(AuthCodes.ROLE_NOT_APPROVED);
    }
    const { resendAfter, devCode } = await this.otpService.createLoginOtp({
      schoolId,
      userId: user.id,
      identifier,
    });
    return { resendAfter, devCode };
  }

  async verifyLoginOtp(schoolId: string, identifier: string, code: string) {
    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
    });
    if (!school) throw new ForbiddenException(AuthCodes.SCHOOL_NOT_FOUND);
    if (!school.isActive)
      throw new ForbiddenException(AuthCodes.SCHOOL_INACTIVE);
    const { userId } = await this.otpService.verifyLoginOtp({
      schoolId,
      identifier,
      code,
    });
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    if (user.globalRole === GlobalRole.SUPER_ADMIN)
      throw new ForbiddenException(AuthCodes.SUPER_ADMIN_ONLY);
    const membership = await this.prismaService.userSchoolMembership.findFirst({
      where: { userId, schoolId, status: MembershipStatus.APPROVED },
    });
    if (!membership) throw new ForbiddenException(AuthCodes.ROLE_NOT_APPROVED);
    const { accessToken, expiresIn } = await this.issueSchoolAccessToken({
      userId,
      schoolId,
      globalRole: user.globalRole,
      schoolRole: membership.role,
    });
    const { refreshToken } = await this.issueRefreshToken({
      userId,
      schoolId,
    });
    return {
      accessToken,
      refreshToken,
      expiresIn,
      me: {
        id: user.id,
        email: user.email ?? undefined,
        phone: user.phone ?? undefined,
        globalRole: user.globalRole,
        schoolRole: membership.role,
        schoolId,
      },
    };
  }

  async rotateRefreshToken(schoolId: string, refreshTokenRaw: string) {
    const tokenHash = this.sha256(refreshTokenRaw);
    const session = await this.prismaService.userSession.findFirst({
      where: { schoolId, tokenHash, revokedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (!session) throw new UnauthorizedException(AuthCodes.REFRESH_INVALID);
    if (session.expiresAt < new Date())
      throw new UnauthorizedException(AuthCodes.REFRESH_EXPIRED);
    await this.prismaService.userSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });
    const user = await this.prismaService.user.findUnique({
      where: { id: session.userId },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    if (user.globalRole === GlobalRole.SUPER_ADMIN)
      throw new ForbiddenException(AuthCodes.SUPER_ADMIN_ONLY);
    const membership = await this.prismaService.userSchoolMembership.findFirst({
      where: {
        userId: session.userId,
        schoolId,
        status: MembershipStatus.APPROVED,
      },
    });
    if (!membership) throw new ForbiddenException(AuthCodes.ROLE_NOT_APPROVED);
    const { accessToken, expiresIn } = await this.issueSchoolAccessToken({
      userId: session.userId,
      schoolId,
      globalRole: user.globalRole,
      schoolRole: membership.role,
    });
    const { refreshToken: newRefreshToken } = await this.issueRefreshToken({
      userId: session.userId,
      schoolId,
    });
    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
      me: {
        id: user.id,
        email: user.email ?? undefined,
        phone: user.phone ?? undefined,
        globalRole: user.globalRole,
        schoolRole: membership.role,
        schoolId,
      },
    };
  }

  async logout(schoolId: string, refreshTokenRaw: string) {
    const tokenHash = this.sha256(refreshTokenRaw);
    const session = await this.prismaService.userSession.findFirst({
      where: { schoolId, tokenHash, revokedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (session)
      await this.prismaService.userSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
    return true;
  }

  // =========== B) SUPER ADMIN LOGIN ===============
  async signInSuperAdmin(email: string, password: string) {
    const e = email.trim().toLowerCase();

    const user = await this.prismaService.user.findUnique({
      where: { email: e },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException(AuthCodes.INVALID_CREDENTIALS);

    if (user.globalRole !== GlobalRole.SUPER_ADMIN) {
      throw new ForbiddenException(AuthCodes.SUPER_ADMIN_ONLY);
    }

    if (!user.passwordHash)
      throw new UnauthorizedException(AuthCodes.INVALID_CREDENTIALS);

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException(AuthCodes.INVALID_CREDENTIALS);

    const { accessToken, expiresIn } = await this.issueSuperAdminAccessToken({
      userId: user.id,
      globalRole: user.globalRole,
    });

    const { refreshToken } = await this.issueRefreshToken({
      userId: user.id,
      schoolId: null, // IMPORTANT: super admin refresh session not tied to school
    });

    return {
      accessToken,
      refreshToken,
      expiresIn,
      me: {
        id: user.id,
        email: user.email ?? undefined,
        phone: user.phone ?? undefined,
        globalRole: user.globalRole,
        // for super admin, no school context
        schoolRole: null as any,
        schoolId: null as any,
      },
    };
  }

  async rotateSuperAdminRefreshToken(refreshTokenRaw: string) {
    const tokenHash = this.sha256(refreshTokenRaw);
    const session = await this.prismaService.userSession.findFirst({
      where: { schoolId: null, tokenHash, revokedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (!session) throw new UnauthorizedException(AuthCodes.REFRESH_INVALID);
    if (session.expiresAt < new Date())
      throw new UnauthorizedException(AuthCodes.REFRESH_EXPIRED);
    await this.prismaService.userSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });
    const user = await this.prismaService.user.findUnique({
      where: { id: session.userId },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    if (user.globalRole !== GlobalRole.SUPER_ADMIN)
      throw new ForbiddenException(AuthCodes.SUPER_ADMIN_ONLY);
    const { accessToken, expiresIn } = await this.issueSuperAdminAccessToken({
      userId: user.id,
      globalRole: user.globalRole,
    });
    const { refreshToken: newRefreshToken } = await this.issueRefreshToken({
      userId: user.id,
      schoolId: null,
    });
    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
      me: {
        id: user.id,
        email: user.email ?? undefined,
        phone: user.phone ?? undefined,
        globalRole: user.globalRole,
        schoolRole: null as any,
        schoolId: null as any,
      },
    };
  }

  async logoutSuperAdmin(refreshTokenRaw: string) {
    const tokenHash = this.sha256(refreshTokenRaw);
    const session = await this.prismaService.userSession.findFirst({
      where: { schoolId: null, tokenHash, revokedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (session)
      await this.prismaService.userSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
    return true;
  }

  // ========== Token issuance helpers ============
  private async issueSchoolAccessToken(payload: {
    userId: string;
    schoolId: string;
    globalRole: any;
    schoolRole: any;
  }) {
    const jwtPayload: JwtPayload = {
      sub: payload.userId,
      schoolId: payload.schoolId,
      globalRole: payload.globalRole,
      schoolRole: payload.schoolRole,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.accessTtl(),
    });

    return {
      accessToken,
      expiresIn: parseAccessTtlToSeconds(this.accessTtl()),
    };
  }

  private async issueSuperAdminAccessToken(payload: {
    userId: string;
    globalRole: any;
  }) {
    const jwtPayload: JwtPayload = {
      sub: payload.userId,
      globalRole: payload.globalRole,
      // no schoolId / schoolRole
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.accessTtl(),
    });

    return {
      accessToken,
      expiresIn: parseAccessTtlToSeconds(this.accessTtl()),
    };
  }

  private async issueRefreshToken(params: {
    userId: string;
    schoolId: string | null;
  }) {
    const refreshToken = nanoid(64);
    const tokenHash = this.sha256(refreshToken);

    await this.prismaService.userSession.create({
      data: {
        userId: params.userId,
        schoolId: params.schoolId,
        tokenType: TokenType.REFRESH,
        tokenHash,
        expiresAt: this.refreshExpiryDate(),
      },
    });

    return { refreshToken };
  }
}
