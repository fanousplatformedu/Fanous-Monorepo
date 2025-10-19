import { createSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/utils/constant";
import { decodeJwt } from "jose";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const accessToken = searchParams.get("accessToken");
    const userId = searchParams.get("userId");
    const name = searchParams.get("name");
    const avatar = searchParams.get("avatar");
    if (!accessToken || !userId || !name)
      return NextResponse.json(
        { error: "Missing required params (accessToken, userId, or name)" },
        { status: 400 }
      );
    const verifyRes = await fetch(`${BACKEND_URL}/auth/verify-token`, {
      headers: { authorization: `Bearer ${accessToken}` },
    });

    if (!verifyRes.ok) {
      const errText = await verifyRes.text();
      console.error("JWT Verification failed:", errText);
      return NextResponse.json(
        { error: "Token verification failed", details: errText },
        { status: verifyRes.status }
      );
    }
    const decoded = decodeJwt(accessToken);
    const role =
      decoded?.role === "ADMIN" ||
      decoded?.role === "PROVIDER" ||
      decoded?.role === "ORGANIZATION" ||
      decoded?.role === "PROFESSIONAL"
        ? decoded.role
        : "PROFESSIONAL";

    await createSession({
      user: {
        id: userId,
        name,
        avatar: avatar ?? undefined,
        role,
      },
      accessToken,
    });
    return NextResponse.redirect(new URL("/", req.url));
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: String(err) },
      { status: 500 }
    );
  }
}
