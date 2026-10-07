import { NextResponse, type NextRequest } from "next/server";

import { locales, matchLocale } from "@/lib/i18n";
import { isShowcase } from "@/lib/showcase";
import {
  hasAccess,
  isGate,
  isLocked,
  KEY_PARAM,
  returnTo,
  showcaseFor,
} from "@/lib/showcase/access";
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
 * `/adar`, `/mavera`, `/gh` and `/engelberg` are pitches for other companies
 * altogether.
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

  // Закрытые витрины — MAVERA, Golden House и Engelberg — без языкового
  // префикса: предложение одноязычное, а языки показаны внутри макетов.
  //
  // Все закрыты кодом, у каждой своим (владелец, 06.10.2026;
  // lib/showcase/access.ts): постоянным кодом студии и короткими кодами из базы
  // студии — 5 цифр на 24 часа, у Engelberg пароль из 4 цифр (lib/showcase/timed.ts).
  // Только вводом на странице пароля: ключ в адресе (?key=…) не пускает.
  // Без куки — страница пароля. Граница стоит здесь, до отдачи разметки.
  // Закрытая витрина закрыта и от поиска.
  const showcase = showcaseFor(pathname);
  if (showcase) {
    if (await isLocked(showcase)) {
      if (isGate(showcase, pathname)) return hidden(NextResponse.next());

      // Владелец, 07.10.2026: «сделай доступы только по паролю». Ключ в
      // адресе больше не пускает — он просто убирается, и человек вводит
      // пароль сам. Ссылки с ключом, уже отправленные заказчикам, ведут на
      // страницу пароля, без «код не подошёл».
      if (request.nextUrl.searchParams.has(KEY_PARAM)) {
        const url = request.nextUrl.clone();
        url.searchParams.delete(KEY_PARAM);
        if (await hasAccess(showcase, (name) => request.cookies.get(name)?.value)) {
          return hidden(NextResponse.redirect(url, 307));
        }
        return hidden(NextResponse.redirect(gateUrl(request, showcase.gate, url), 307));
      }

      if (!(await hasAccess(showcase, (name) => request.cookies.get(name)?.value))) {
        return hidden(NextResponse.redirect(gateUrl(request, showcase.gate, request.nextUrl), 307));
      }
      return hidden(NextResponse.next());
    }

    // Код снят на сервере (`off`): страница кода и ключ в адресе просто
    // приводят на страницу витрины.
    if (isGate(showcase, pathname)) {
      const target = new URL(returnTo(showcase, request.nextUrl.searchParams.get("next")), "http://showcase.local");
      const url = request.nextUrl.clone();
      url.pathname = target.pathname;
      url.search = target.search;
      return noindex(NextResponse.redirect(url, 307));
    }

    if (request.nextUrl.searchParams.has(KEY_PARAM)) {
      const url = request.nextUrl.clone();
      url.searchParams.delete(KEY_PARAM);
      return noindex(NextResponse.redirect(url, 307));
    }

    return noindex(NextResponse.next());
  }

  // Открытые витрины: мебельная фабрика, зарубежная недвижимость и
  // оператор связи. Кода доступа у них нет — так решил заказчик показа, —
  // поэтому они просто пропускаются мимо языкового префикса. У каждой
  // свой язык внутри: у Namuna и Tranio русский, у Транстелекома русский
  // и казахский, и переключает их сама страница.
  if (
    pathname === "/namuna" ||
    pathname.startsWith("/namuna/") ||
    pathname === "/tranio" ||
    pathname.startsWith("/tranio/") ||
    pathname === "/ttc" ||
    pathname.startsWith("/ttc/")
  ) {
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

  // Шестой проект витрины — сайт фабрики дверей Akbar Rich. Одноязычный
  // прототип, без кода доступа: пропускается мимо языкового префикса.
  if (pathname === "/akbar" || pathname.startsWith("/akbar/")) {
    return noindex(NextResponse.next());
  }

  // Проект витрины — прототип сайта мебельной фабрики Comfort Mebel.
  // Без языкового префикса. Индексацию решают метаданные страницы
  // (`projectRobots`): на площадке открыт поиску, на боевом сайте закрыт.
  if (pathname === "/comfort" || pathname.startsWith("/comfort/")) {
    return NextResponse.next();
  }

  // Проект витрины — макет сайта MedAcademy, центра подготовки в медвузы.
  // Без языкового префикса, индексацию решает `projectRobots`, как у Comfort.
  if (pathname === "/medacademy" || pathname.startsWith("/medacademy/")) {
    return NextResponse.next();
  }

  // Проект витрины — макет сайта Arsenal D (webname.uz), регистратора .UZ и
  // хостинга. Без языкового префикса, индексацию решает `projectRobots`.
  if (pathname === "/webname" || pathname.startsWith("/webname/")) {
    return NextResponse.next();
  }

  // Проект витрины — макет сайта турагентства Apollo Travel (goapollo.uz).
  // Без языкового префикса, индексацию решает `projectRobots`.
  if (pathname === "/apollo" || pathname.startsWith("/apollo/")) {
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

/**
 * Проекты чужих компаний — в поиск только с площадки.
 *
 * На площадке (`SHOWCASE_ROOT=true`) заголовок не ставится: с 29.09.2026
 * проекты витрины открыты поиску (lib/showcase/seo). На боевом сайте Global
 * Export, собранном из этого же кода, чужие проекты в выдаче не нужны.
 */
function noindex(response: NextResponse): NextResponse {
  if (isShowcase) return response;
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

/** Закрытая витрина закрыта от поиска и на площадке: поисковик видел бы только форму кода. */
function hidden(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

/** Страница кода с адресом возврата — без ключа в нём. */
function gateUrl(request: NextRequest, gate: string, from: URL, wrongKey = false): URL {
  const back = new URL(from);
  back.searchParams.delete(KEY_PARAM);
  const url = request.nextUrl.clone();
  url.pathname = gate;
  url.search = "";
  url.searchParams.set("next", `${back.pathname}${back.search}`);
  if (wrongKey) url.searchParams.set("error", "1");
  return url;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
