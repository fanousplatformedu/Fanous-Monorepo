import { ForbiddenException, Injectable } from "@nestjs/common";
import { MembershipStatus, TokenType } from "@prisma/client";
import { parseAccessTtlToSeconds } from "@utils/function-helper";
import { UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { OtpService } from "@auth/services/oto.service";
import { JwtPayload } from "@auth/types/jwt-payload.type";
import { AuthCodes } from "@auth/enums/auth-errors.enum";
import { nanoid } from "nanoid";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

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

  private refreshPepper() {
    return (
      this.configService.get<string>("REFRESH_TOKEN_PEPPER") ??
      "default-pepper-change-me"
    );
  }

  private hashRefreshToken(token: string) {
    return this.sha256(`${this.refreshPepper()}:${token}`);
  }

  private async assertSchoolActive(schoolId: string) {
    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
      select: { id: true, isActive: true },
    });
    if (!school) throw new ForbiddenException(AuthCodes.SCHOOL_NOT_FOUND);
    if (!school.isActive)
      throw new ForbiddenException(AuthCodes.SCHOOL_INACTIVE);
  }

  async requestLoginOtp(schoolId: string, identifier: string) {
    await this.assertSchoolActive(schoolId);
    const normalizedEmail = identifier.trim().toLowerCase();
    const normalizedPhone = identifier.trim().replace(/\s/g, "");
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { phone: normalizedPhone }],
      },
      select: { id: true },
    });
    if (!user) throw new ForbiddenException(AuthCodes.USER_NOT_FOUND);
    const membership = await this.prismaService.userSchoolMembership.findFirst({
      where: { userId: user.id, schoolId, status: MembershipStatus.APPROVED },
      select: { id: true },
    });
    if (!membership) {
      const any = await this.prismaService.userSchoolMembership.findFirst({
        where: { userId: user.id, schoolId },
        select: { id: true, status: true },
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
    await this.assertSchoolActive(schoolId);
    const { userId } = await this.otpService.verifyLoginOtp({
      schoolId,
      identifier,
      code,
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
    const membership = await this.prismaService.userSchoolMembership.findFirst({
      where: { userId, schoolId, status: MembershipStatus.APPROVED },
      select: { role: true },
    });
    if (!membership) throw new ForbiddenException(AuthCodes.ROLE_NOT_APPROVED);
    const { accessToken, expiresIn } = await this.issueAccessToken({
      userId,
      schoolId,
      globalRole: user.globalRole,
      schoolRole: membership.role,
    });
    const { refreshToken } = await this.issueRefreshToken({ userId, schoolId });
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

  private async issueAccessToken(payload: {
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

  private async issueRefreshToken(params: {
    userId: string;
    schoolId: string;
  }) {
    const refreshToken = nanoid(64);
    const tokenHash = this.hashRefreshToken(refreshToken);

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

  async rotateRefreshToken(schoolId: string, refreshToken: string) {
    await this.assertSchoolActive(schoolId);
    const tokenHash = this.hashRefreshToken(refreshToken);
    return this.prismaService.$transaction(async (tx) => {
      const session = await tx.userSession.findFirst({
        where: { schoolId, tokenHash, revokedAt: null },
        orderBy: { createdAt: "desc" },
      });
      if (!session) throw new UnauthorizedException(AuthCodes.REFRESH_INVALID);
      if (session.expiresAt < new Date())
        throw new UnauthorizedException(AuthCodes.REFRESH_EXPIRED);
      await tx.userSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
      const user = await tx.user.findUnique({
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

      const membership = await tx.userSchoolMembership.findFirst({
        where: { userId: user.id, schoolId, status: MembershipStatus.APPROVED },
        select: { role: true },
      });
      if (!membership)
        throw new ForbiddenException(AuthCodes.ROLE_NOT_APPROVED);

      const { accessToken, expiresIn } = await this.issueAccessToken({
        userId: user.id,
        schoolId,
        globalRole: user.globalRole,
        schoolRole: membership.role,
      });

      const { refreshToken: newRefreshToken } = await this.issueRefreshToken({
        userId: user.id,
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
    });
  }

  async logout(schoolId: string, refreshToken: string) {
    const tokenHash = this.hashRefreshToken(refreshToken);
    const session = await this.prismaService.userSession.findFirst({
      where: { schoolId, tokenHash, revokedAt: null },
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
}
