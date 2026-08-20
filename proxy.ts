import { NextResponse, type NextRequest } from "next/server";

import { locales, matchLocale } from "@/lib/i18n";
import { refreshSession } from "@/lib/supabase/session";

const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|json|webmanifest)$/i;

/**
 * Every page lives under a locale prefix. A visit without one is redirected to
 * the language the browser asks for, so `globalex.uz` still works as an entry
 * point and search engines land on a canonical URL.
 *
 * The admin panel is the exception: it is a single-language tool, sits outside
 * the prefix, and needs its Supabase session refreshed on the way through.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Rotating the refresh token needs a response to write cookies onto, which a
  // Server Component cannot provide. Doing it here keeps the panel signed in.
  // It only refreshes — the layout is what decides whether access is allowed.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return refreshSession(request);
  }

  const [, first = "", ...rest] = pathname.split("/");
  const lower = first.toLowerCase();
  const matched = locales.find((locale) => locale === lower);

  if (matched) {
    // `/EN/about` would otherwise fall through and gain a second prefix.
    if (first !== matched) {
      const url = request.nextUrl.clone();
      url.pathname = `/${matched}${rest.length ? `/${rest.join("/")}` : ""}`;
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  const locale = matchLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  // 308 rather than the default 307: prefixing is permanent, and crawlers
  // should consolidate signals onto the prefixed URL.
  const response = NextResponse.redirect(url, 308);
  // The target depends on the request header, so a shared cache must not
  // serve one visitor's language to the next.
  response.headers.set("Vary", "Accept-Language");
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
