import { NextResponse } from "next/server";

import {
  accessCode,
  accessCookie,
  accessToken,
  safeNext,
  sameSecret,
  showcaseOfNext,
  showcases,
} from "@/lib/showcase/access";

/**
 * Проверка кода с формы.
 *
 * Обычный POST с редиректом 303, а не серверная функция: куки должна лежать в
 * ответе, который браузер получит до перехода на закрытую страницу, иначе
 * прокси на этом переходе её ещё не увидит и вернёт на форму. Адрес возврата
 * относительный — за nginx абсолютный собрался бы с внутренним хостом.
 *
 * Витрин несколько, и какая из них — видно по адресу возврата: форма шлёт
 * `next`, он уже проверен на «свой и относительный», и его префикс выбирает
 * и код, и куки, и страницу, куда вернуть при ошибке.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const raw = String(form.get("next") ?? "");
  const showcase = showcaseOfNext(raw.startsWith("/") ? raw : showcases[0].prefix);
  const next = safeNext(showcase, raw);
  const code = accessCode(showcase);

  if (!code) return new NextResponse(null, { status: 303, headers: { Location: next } });

  const given = String(form.get("code") ?? "").trim();
  if (!sameSecret(given, code)) {
    const back = `${showcase.gate}?next=${encodeURIComponent(next)}&error=1`;
    return new NextResponse(null, { status: 303, headers: { Location: back } });
  }

  const response = new NextResponse(null, { status: 303, headers: { Location: next } });
  response.cookies.set(accessCookie(showcase, await accessToken(showcase, code)));
  return response;
}
