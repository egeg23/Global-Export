import { NextResponse, type NextRequest } from "next/server";

import { locales, matchLocale } from "@/lib/i18n";
import { refreshSession } from "@/lib/supabase/session";

const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|json|webmanifest)$/i;

/**
 * Every page lives under a locale prefix. A visit without one is redirected to
 * the language the browser asks for, so `globalex.uz` still works as an entry
 * point and search engines land on a canonical URL.
 *
 * Three routes sit outside that rule. The admin panel is a single-language tool
 * and needs its Supabase session refreshed on the way through. The showcase at
 * `/present` belongs to the pitch rather than to the company's site, and
 * `/adar` is a second pitch altogether — design concepts for another company.
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

  if (pathname === "/present" || pathname.startsWith("/present/")) {
    return NextResponse.next();
  }

  // Второй проект витрины — концепции сайта для другой компании. Языкового
  // префикса у него нет: предложение одноязычное.
  if (pathname === "/adar" || pathname.startsWith("/adar/")) {
    return NextResponse.next();
  }

  // On the demo deployment the root is the showcase; on the live site it stays
  // the language redirect. One variable rather than two builds of the app.
  if (pathname === "/" && process.env.SHOWCASE_ROOT === "true") {
    const url = request.nextUrl.clone();
    url.pathname = "/present";
    return NextResponse.redirect(url, 307);
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
