import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { GlobalRole, OtpPurpose, SchoolRole } from "@prisma/client";
import { parseAccessTtlToSeconds } from "@utils/guard-helper";
import { ConfigService } from "@nestjs/config";
import { AuthCodes } from "@auth/enums/auth-errors.enum";
import { LoginAs } from "@enums/otp-register.enum";

export const isProd = (configService: ConfigService): boolean =>
  (configService.get("NODE_ENV") ?? process.env.NODE_ENV) === "production";

export const accessTtl = (configService: ConfigService): string =>
  configService.get<string>("ACCESS_TOKEN_TTL") ?? "15m";

export const refreshDays = (configService: ConfigService): number =>
  Number(configService.get("REFRESH_TOKEN_TTL_DAYS") ?? 30);

export const refreshExpiryDate = (configService: ConfigService): Date => {
  const days = refreshDays(configService);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

export const cookieCommon = (configService: ConfigService) => {
  return {
    httpOnly: true,
    secure: isProd(configService),
    sameSite: "lax" as const,
    path: "/",
  };
};

export const cookieAccessOptions = (configService: ConfigService) => {
  const seconds = parseAccessTtlToSeconds(accessTtl(configService));
  return { ...cookieCommon(configService), maxAge: seconds * 1000 };
};

export const cookieRefreshOptions = (configService: ConfigService) => {
  return {
    ...cookieCommon(configService),
    maxAge: refreshDays(configService) * 24 * 60 * 60 * 1000,
  };
};

export const getCookieValue = (input: { req: any; name: string }): string => {
  const v = input.req?.cookies?.[input.name];
  if (!v || typeof v !== "string")
    throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
  return v;
};

export const sha256 = (input: string): string => {
  const crypto = require("crypto") as typeof import("crypto");
  return crypto.createHash("sha256").update(input).digest("hex");
};

export const normalizeEmail = (v: string): string => v.trim().toLowerCase();

export const normalizePhone = (v: string): string =>
  v.trim().replace(/\s/g, "");

export const mapPurpose = (loginAs: LoginAs): OtpPurpose => {
  return loginAs === LoginAs.SCHOOL_ADMIN
    ? OtpPurpose.SCHOOL_ADMIN_LOGIN
    : OtpPurpose.USER_LOGIN;
};

export const ensureRoleAllowed = (loginAs: LoginAs, role: SchoolRole): void => {
  if (loginAs === LoginAs.SCHOOL_ADMIN) {
    if (role !== SchoolRole.SCHOOL_ADMIN)
      throw new ForbiddenException(AuthCodes.FORBIDDEN);
    return;
  }
  if (role === SchoolRole.SCHOOL_ADMIN)
    throw new ForbiddenException(AuthCodes.FORBIDDEN);
};

export const ensureNotSuperAdmin = (globalRole: GlobalRole): void => {
  if (globalRole === GlobalRole.SUPER_ADMIN)
    throw new ForbiddenException(AuthCodes.SUPER_ADMIN_ONLY);
};

export const parseExpiresInSeconds = (configService: ConfigService): number =>
  parseAccessTtlToSeconds(accessTtl(configService));
