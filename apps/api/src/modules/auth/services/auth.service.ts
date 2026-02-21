import { GlobalRole, MembershipStatus, TokenType } from "@prisma/client";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { OtpService } from "@auth/services/oto.service";
import { AuthCodes } from "@auth/enums/auth-errors.enum";
import { nanoid } from "nanoid";

import * as argon2 from "argon2";
import * as H from "@utils/auth-helper";
import * as T from "@auth/types/auth-service.types";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  // ---------- cookies ----------
  getCookie(input: T.TCookieGetInput): string {
    return H.getCookieValue(input);
  }

  setSchoolAuthCookies(input: T.TCookieSetInput): void {
    input.res.cookie(
      "sk_at",
      input.tokens.accessToken,
      H.cookieAccessOptions(this.configService),
    );
    input.res.cookie(
      "sk_rt",
      input.tokens.refreshToken,
      H.cookieRefreshOptions(this.configService),
    );
  }

  clearSchoolAuthCookies(input: T.TCookieClearInput): void {
    input.res.clearCookie("sk_at", { path: "/" });
    input.res.clearCookie("sk_rt", { path: "/" });
  }

  setSuperAdminAuthCookies(input: T.TCookieSetInput): void {
    input.res.cookie(
      "sa_at",
      input.tokens.accessToken,
      H.cookieAccessOptions(this.configService),
    );
    input.res.cookie(
      "sa_rt",
      input.tokens.refreshToken,
      H.cookieRefreshOptions(this.configService),
    );
  }

  clearSuperAdminAuthCookies(input: T.TCookieClearInput): void {
    input.res.clearCookie("sa_at", { path: "/" });
    input.res.clearCookie("sa_rt", { path: "/" });
  }

  // ============ A) SCHOOL OTP LOGIN ============
  async requestLoginOtp(
    input: T.TRequestLoginOtpInput,
  ): Promise<T.TRequestLoginOtpOutput> {
    const school = await this.prismaService.school.findUnique({
      where: { id: input.schoolId },
    });
    if (!school) throw new ForbiddenException(AuthCodes.SCHOOL_NOT_FOUND);
    if (!school.isActive)
      throw new ForbiddenException(AuthCodes.SCHOOL_INACTIVE);
    const emailN = input.identifier.includes("@")
      ? H.normalizeEmail(input.identifier)
      : null;
    const phoneN = !emailN ? H.normalizePhone(input.identifier) : null;
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          ...(emailN ? [{ emailNormalized: emailN }] : []),
          ...(phoneN ? [{ phoneNormalized: phoneN }] : []),
        ],
      },
      select: { id: true, isActive: true, globalRole: true },
    });

    if (!user || !user.isActive)
      throw new ForbiddenException(AuthCodes.USER_NOT_FOUND);
    H.ensureNotSuperAdmin(user.globalRole);
    const membership = await this.prismaService.userSchoolMembership.findFirst({
      where: {
        userId: user.id,
        schoolId: input.schoolId,
        status: MembershipStatus.APPROVED,
      },
      select: { approvedRole: true },
    });

    if (!membership?.approvedRole)
      throw new ForbiddenException(AuthCodes.ROLE_NOT_APPROVED);
    H.ensureRoleAllowed(input.loginAs, membership.approvedRole);
    const { resendAfter, devCode } = await this.otpService.createLoginOtp({
      schoolId: input.schoolId,
      userId: user.id,
      identifier: input.identifier,
      purpose: H.mapPurpose(input.loginAs),
    });
    return { resendAfter, devCode };
  }

  async verifyLoginOtp(
    input: T.TVerifyLoginOtpInput,
  ): Promise<T.TVerifyLoginOtpOutput> {
    const school = await this.prismaService.school.findUnique({
      where: { id: input.schoolId },
    });
    if (!school) throw new ForbiddenException(AuthCodes.SCHOOL_NOT_FOUND);
    if (!school.isActive)
      throw new ForbiddenException(AuthCodes.SCHOOL_INACTIVE);
    const { userId } = await this.otpService.verifyLoginOtp({
      schoolId: input.schoolId,
      identifier: input.identifier,
      code: input.code,
      purpose: H.mapPurpose(input.loginAs),
    });

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        isActive: true,
        globalRole: true,
      },
    });

    if (!user || !user.isActive)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    H.ensureNotSuperAdmin(user.globalRole);
    const membership = await this.prismaService.userSchoolMembership.findFirst({
      where: {
        userId,
        schoolId: input.schoolId,
        status: MembershipStatus.APPROVED,
      },
      select: { approvedRole: true },
    });
    if (!membership?.approvedRole)
      throw new ForbiddenException(AuthCodes.ROLE_NOT_APPROVED);
    H.ensureRoleAllowed(input.loginAs, membership.approvedRole);
    const { accessToken, expiresIn } = await this.issueSchoolAccessToken({
      userId,
      schoolId: input.schoolId,
      globalRole: user.globalRole,
      schoolRole: membership.approvedRole,
    });

    const { refreshToken } = await this.issueRefreshToken({
      userId,
      schoolId: input.schoolId,
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
        schoolRole: membership.approvedRole,
        schoolId: input.schoolId,
      },
    };
  }

  async rotateRefreshToken(
    input: T.TRotateRefreshTokenInput,
  ): Promise<T.TVerifyLoginOtpOutput> {
    const tokenHash = H.sha256(input.refreshTokenRaw);
    const session = await this.prismaService.userSession.findFirst({
      where: { schoolId: input.schoolId, tokenHash, revokedAt: null },
      orderBy: { createdAt: "desc" },
      select: { id: true, userId: true, expiresAt: true, schoolId: true },
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
      select: {
        id: true,
        email: true,
        phone: true,
        isActive: true,
        globalRole: true,
      },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    H.ensureNotSuperAdmin(user.globalRole);
    const membership = await this.prismaService.userSchoolMembership.findFirst({
      where: {
        userId: user.id,
        schoolId: input.schoolId,
        status: MembershipStatus.APPROVED,
      },
      select: { approvedRole: true },
    });
    if (!membership?.approvedRole)
      throw new ForbiddenException(AuthCodes.ROLE_NOT_APPROVED);
    const { accessToken, expiresIn } = await this.issueSchoolAccessToken({
      userId: user.id,
      schoolId: input.schoolId,
      globalRole: user.globalRole,
      schoolRole: membership.approvedRole,
    });
    const { refreshToken: newRefreshToken } = await this.issueRefreshToken({
      userId: user.id,
      schoolId: input.schoolId,
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
        schoolRole: membership.approvedRole,
        schoolId: input.schoolId,
      },
    };
  }

  async logout(input: T.TLogoutInput): Promise<boolean> {
    const tokenHash = H.sha256(input.refreshTokenRaw);
    const session = await this.prismaService.userSession.findFirst({
      where: { schoolId: input.schoolId, tokenHash, revokedAt: null },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    if (session) {
      await this.prismaService.userSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
    }
    return true;
  }

  // ============ B) SUPER ADMIN LOGIN ============
  async signInSuperAdmin(
    input: T.TSignInSuperAdminInput,
  ): Promise<T.TSignInSuperAdminOutput> {
    const e = H.normalizeEmail(input.email);
    const user = await this.prismaService.user.findUnique({
      where: { emailNormalized: e },
      select: {
        id: true,
        email: true,
        phone: true,
        isActive: true,
        globalRole: true,
        passwordHash: true,
      },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException(AuthCodes.INVALID_CREDENTIALS);
    if (user.globalRole !== GlobalRole.SUPER_ADMIN)
      throw new ForbiddenException(AuthCodes.SUPER_ADMIN_ONLY);
    if (!user.passwordHash)
      throw new UnauthorizedException(AuthCodes.INVALID_CREDENTIALS);
    const ok = await argon2.verify(user.passwordHash, input.password);
    if (!ok) throw new UnauthorizedException(AuthCodes.INVALID_CREDENTIALS);
    const { accessToken, expiresIn } = await this.issueSuperAdminAccessToken({
      userId: user.id,
      globalRole: user.globalRole,
    });
    const { refreshToken } = await this.issueRefreshToken({
      userId: user.id,
      schoolId: null,
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
      },
    };
  }

  async rotateSuperAdminRefreshToken(
    input: T.TRotateSuperAdminRefreshTokenInput,
  ): Promise<T.TSignInSuperAdminOutput> {
    const tokenHash = H.sha256(input.refreshTokenRaw);
    const session = await this.prismaService.userSession.findFirst({
      where: { schoolId: null, tokenHash, revokedAt: null },
      orderBy: { createdAt: "desc" },
      select: { id: true, userId: true, expiresAt: true },
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
      select: {
        id: true,
        email: true,
        phone: true,
        isActive: true,
        globalRole: true,
      },
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
      },
    };
  }

  async logoutSuperAdmin(input: T.TLogoutSuperAdminInput): Promise<boolean> {
    const tokenHash = H.sha256(input.refreshTokenRaw);
    const session = await this.prismaService.userSession.findFirst({
      where: { schoolId: null, tokenHash, revokedAt: null },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    if (session) {
      await this.prismaService.userSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
    }
    return true;
  }

  // ============ token helpers =============
  async issueSchoolAccessToken(
    payload: T.TIssueSchoolAccessTokenInput,
  ): Promise<T.TIssueAccessTokenOutput> {
    const jwtPayload = {
      sub: payload.userId,
      schoolId: payload.schoolId,
      globalRole: payload.globalRole,
      schoolRole: payload.schoolRole,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: H.accessTtl(this.configService),
    });
    return {
      accessToken,
      expiresIn: H.parseExpiresInSeconds(this.configService),
    };
  }

  async issueSuperAdminAccessToken(
    payload: T.TIssueSuperAdminAccessTokenInput,
  ): Promise<T.TIssueAccessTokenOutput> {
    const jwtPayload = {
      sub: payload.userId,
      globalRole: payload.globalRole,
    };
    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: H.accessTtl(this.configService),
    });
    return {
      accessToken,
      expiresIn: H.parseExpiresInSeconds(this.configService),
    };
  }

  async issueRefreshToken(
    params: T.TIssueRefreshTokenInput,
  ): Promise<T.TIssueRefreshTokenOutput> {
    const refreshToken = nanoid(64);
    const tokenHash = H.sha256(refreshToken);
    await this.prismaService.userSession.create({
      data: {
        userId: params.userId,
        schoolId: params.schoolId,
        tokenType: TokenType.REFRESH,
        tokenHash,
        expiresAt: H.refreshExpiryDate(this.configService),
      },
    });
    return { refreshToken };
  }
}
