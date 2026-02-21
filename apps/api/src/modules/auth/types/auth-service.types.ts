import { GlobalRole, SchoolRole } from "@prisma/client";
import { LoginAs } from "@enums/otp-register.enum";

// ---------- cookies ----------
export type TAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TCookieGetInput = {
  req: any;
  name: string;
};

export type TCookieSetInput = {
  res: any;
  tokens: TAuthTokens;
};

export type TCookieClearInput = {
  res: any;
};

// ---------- A) school otp login ----------
export type TRequestLoginOtpInput = {
  schoolId: string;
  loginAs: LoginAs;
  identifier: string;
};

export type TRequestLoginOtpOutput = {
  devCode?: string;
  resendAfter: number | Date;
};

export type TVerifyLoginOtpInput = {
  code: string;
  schoolId: string;
  loginAs: LoginAs;
  identifier: string;
};

export type TAuthMe = {
  id: string;
  email?: string;
  phone?: string;
  schoolId?: string;
  globalRole: GlobalRole;
  schoolRole?: SchoolRole;
};

export type TVerifyLoginOtpOutput = {
  me: TAuthMe;
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
};

export type TRotateRefreshTokenInput = {
  schoolId: string;
  refreshTokenRaw: string;
};

export type TLogoutInput = {
  schoolId: string;
  refreshTokenRaw: string;
};

// ---------- B) super admin ----------
export type TSignInSuperAdminInput = {
  email: string;
  password: string;
};

export type TSignInSuperAdminOutput = {
  me: TAuthMe;
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
};

export type TRotateSuperAdminRefreshTokenInput = {
  refreshTokenRaw: string;
};

export type TLogoutSuperAdminInput = {
  refreshTokenRaw: string;
};

// ---------- token helpers ----------
export type TIssueSchoolAccessTokenInput = {
  userId: string;
  schoolId: string;
  globalRole: GlobalRole;
  schoolRole: SchoolRole;
};

export type TIssueAccessTokenOutput = {
  expiresIn: number;
  accessToken: string;
};

export type TIssueSuperAdminAccessTokenInput = {
  userId: string;
  globalRole: GlobalRole;
};

export type TIssueRefreshTokenInput = {
  userId: string;
  schoolId: string | null;
};

export type TIssueRefreshTokenOutput = {
  refreshToken: string;
};
