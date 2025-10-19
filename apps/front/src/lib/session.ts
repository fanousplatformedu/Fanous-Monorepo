import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { TSession } from "@/types/auth";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET_KEY!;
const key = new TextEncoder().encode(secretKey);

const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

// ========================
// CREATE SESSION
// ========================
export const createSession = async (payload: TSession) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key);
  const cookie = await cookies();
  cookie.set(SESSION_COOKIE_NAME, token, {
    path: "/",
    secure: false,
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
  });
};

// ========================
// GET SESSION
// ========================
export const getSession = async (): Promise<TSession | null> => {
  const cookie = await cookies();
  const getCookie = cookie.get(SESSION_COOKIE_NAME)?.value;
  if (!getCookie) return null;
  try {
    const { payload } = await jwtVerify<TSession>(getCookie, key, {
      algorithms: ["HS256"],
    });
    return payload as TSession;
  } catch (err) {
    console.error("Invalid or expired session:", err);
    redirect("/auth/signin");
  }
};

// ========================
// DELETE SESSION
// ========================
export const deleteSession = async () => {
  const cookie = await cookies();
  cookie.set(SESSION_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  });
};
