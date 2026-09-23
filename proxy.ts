import { NextResponse, type NextRequest } from "next/server";

import { locales, matchLocale } from "@/lib/i18n";
import { isGate, LEGACY_KEY_PARAM, returnTo, showcaseFor } from "@/lib/showcase/access";
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
 * `/adar`, `/mavera` and `/gh` are pitches for other companies altogether.
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

  // Витрины застройщиков MAVERA и Golden House — без языкового префикса:
  // предложение одноязычное, а языки показаны внутри макетов. Раньше они
  // открывались по коду, теперь открыты всем, у кого есть ссылка (решение
  // владельца от 23.09.2026, см. lib/showcase/access.ts), — от переменных
  // окружения это не зависит. Старые ссылки приводят туда же: бывшая
  // страница ввода кода ведёт на адрес из `next`, а ключ `?key=…` просто
  // убирается из адреса. Из поиска витрины по-прежнему закрыты.
  const showcase = showcaseFor(pathname);
  if (showcase) {
    if (isGate(showcase, pathname)) {
      const target = new URL(returnTo(showcase, request.nextUrl.searchParams.get("next")), "http://showcase.local");
      const url = request.nextUrl.clone();
      url.pathname = target.pathname;
      url.search = target.search;
      return noindex(NextResponse.redirect(url, 307));
    }

    if (request.nextUrl.searchParams.has(LEGACY_KEY_PARAM)) {
      const url = request.nextUrl.clone();
      url.searchParams.delete(LEGACY_KEY_PARAM);
      return noindex(NextResponse.redirect(url, 307));
    }

    return noindex(NextResponse.next());
  }

  // Макет фабрики мебели. Единственная витрина без кода доступа — так
  // решил заказчик показа, — поэтому она просто пропускается мимо
  // языкового префикса.
  if (pathname === "/namuna" || pathname.startsWith("/namuna/")) {
    return NextResponse.next();
  }

  // Второй проект витрины — концепции сайта для другой компании. Языкового
  // префикса у него нет: предложение одноязычное.
  if (pathname === "/adar" || pathname.startsWith("/adar/")) {
    return NextResponse.next();
  }

  // Четвёртый проект витрины — сайт производителя консервации. Тоже без
  // языкового префикса.
  if (pathname === "/foodmaxx" || pathname.startsWith("/foodmaxx/")) {
    return NextResponse.next();
  }

  // Пятый проект витрины — сайт детской IT-школы Delta. Одноязычный, без
  // кода доступа: как и FOODMAXX, пропускается мимо языкового префикса.
  if (pathname === "/delta" || pathname.startsWith("/delta/")) {
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

/** Витрины открыты по ссылке, но не для поиска. */
function noindex(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
