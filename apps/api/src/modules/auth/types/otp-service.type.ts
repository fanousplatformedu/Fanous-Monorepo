import { OtpChannel, OtpPurpose } from "@prisma/client";

export type TOtpEnsureRateLimitInput = {
  schoolId: string;
  identifier: string;
  purpose: OtpPurpose;
};

export type TOtpCreateLoginInput = {
  ip?: string;
  userId: string;
  schoolId: string;
  identifier: string;
  purpose: OtpPurpose;
  userAgent?: string;
};

export type TOtpCreateLoginOutput = {
  devCode?: string;
  resendAfter: Date;
};

export type TOtpVerifyLoginInput = {
  code: string;
  schoolId: string;
  identifier: string;
  purpose: OtpPurpose;
};

export type TOtpVerifyLoginOutput = {
  userId: string;
};

export type TNormalizedIdentifier = {
  channel: OtpChannel;
  email: string | null;
  phone: string | null;
  emailNormalized: string | null;
  phoneNormalized: string | null;
};
