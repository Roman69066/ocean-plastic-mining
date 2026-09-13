import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  configuredLaunchDate,
  countVisitors,
  visitorHash,
} from "@/lib/site-stats";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const cookieName = "opm-visitor";
function config() {
  return {
    url: process.env.COUNTER_REDIS_REST_URL,
    token: process.env.COUNTER_REDIS_REST_TOKEN,
    namespace: process.env.COUNTER_NAMESPACE,
  };
}
function reply(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      Vary: "Cookie, Sec-GPC, DNT",
    },
  });
}
async function handle(request: NextRequest, count: boolean) {
  const launchedAt = configuredLaunchDate(
    process.env.NEXT_PUBLIC_SITE_LAUNCHED_AT,
  );
  const privacyOptOut =
    request.headers.get("Sec-GPC") === "1" ||
    request.headers.get("DNT") === "1";
  let id = request.cookies.get(cookieName)?.value;
  if (id) {
    try {
      visitorHash(id);
    } catch {
      id = undefined;
    }
  }
  const issueCookie = count && !privacyOptOut && !id;
  if (issueCookie) id = randomUUID();
  try {
    const visitors = await countVisitors(
      config(),
      count && !privacyOptOut ? id : undefined,
    );
    const response = reply({
      launchedAt,
      visitors,
      counterStatus: visitors === null ? "unconfigured" : "active",
      metric: "unique-anonymous-browsers",
      privacyOptOut,
    });
    if (issueCookie && visitors !== null && id)
      response.cookies.set(cookieName, id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    return response;
  } catch {
    return reply(
      {
        launchedAt,
        visitors: null,
        counterStatus: "unavailable",
        metric: "unique-anonymous-browsers",
      },
      503,
    );
  }
}
export async function GET(request: NextRequest) {
  return handle(request, false);
}
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowed = new Set([request.nextUrl.origin]);
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    } catch {}
  }
  if (
    !origin ||
    !allowed.has(origin) ||
    !request.headers.get("content-type")?.startsWith("application/json")
  )
    return reply({ error: "Same-origin JSON request required" }, 403);
  return handle(request, true);
}
