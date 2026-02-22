import { AuthCookie } from "@auth/enums/auth-cookie.enum";
import { Request } from "express";

export const cookieOrBearerExtractor = (req: Request): string | null => {
  const cookieToken = req?.cookies?.[AuthCookie.AccessToken];
  if (cookieToken) return cookieToken;
  const authHeader = req.headers["authorization"];
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer "))
    return authHeader.slice(7);
  return null;
};
