export type TCookieOptionsConfig = {
  domain?: string;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
};
