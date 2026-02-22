import { TCookieOptionsConfig } from "@auth/types";
import { AuthCookie } from "@auth/enums/auth-cookie.enum";
import { Response } from "express";

export const setAuthCookies = (
  res: Response,
  data: { accessToken: string; refreshToken: string; sid: string },
  cfg: TCookieOptionsConfig,
  ttl: { accessSeconds: number; refreshSeconds: number },
) => {
  res.cookie(AuthCookie.AccessToken, data.accessToken, {
    httpOnly: true,
    secure: cfg.secure,
    sameSite: cfg.sameSite,
    domain: cfg.domain,
    path: "/",
    maxAge: ttl.accessSeconds * 1000,
  });

  res.cookie(AuthCookie.RefreshToken, data.refreshToken, {
    httpOnly: true,
    secure: cfg.secure,
    sameSite: cfg.sameSite,
    domain: cfg.domain,
    path: "/",
    maxAge: ttl.refreshSeconds * 1000,
  });

  res.cookie(AuthCookie.Sid, data.sid, {
    httpOnly: true,
    secure: cfg.secure,
    sameSite: cfg.sameSite,
    domain: cfg.domain,
    path: "/",
    maxAge: ttl.refreshSeconds * 1000,
  });
};

export const clearAuthCookies = (res: Response, cfg: TCookieOptionsConfig) => {
  for (const name of [
    AuthCookie.AccessToken,
    AuthCookie.RefreshToken,
    AuthCookie.Sid,
  ]) {
    res.cookie(name, "", {
      httpOnly: true,
      secure: cfg.secure,
      sameSite: cfg.sameSite,
      domain: cfg.domain,
      path: "/",
      maxAge: 0,
    });
  }
};
