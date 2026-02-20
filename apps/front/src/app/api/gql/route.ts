import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const backendUrl = process.env.BACKEND_URL!;
  const body = await req.text();
  const upstream = await fetch(`${backendUrl}/graphql`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: req.headers.get("cookie") ?? "",
      authorization: req.headers.get("authorization") ?? "",
    },
    body,
  });
  const resBody = await upstream.text();
  const res = new NextResponse(resBody, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
  const anyHeaders = upstream.headers;
  const cookies =
    typeof anyHeaders.getSetCookie === "function"
      ? anyHeaders.getSetCookie()
      : [];
  if (cookies?.length) {
    cookies.forEach((c: string) => res.headers.append("set-cookie", c));
  } else {
    const single = upstream.headers.get("set-cookie");
    if (single) res.headers.set("set-cookie", single);
  }
  return res;
}
