import { NextResponse } from "next/server";

import { accessCode, accessCookie, accessToken, safeNext, sameSecret } from "@/lib/showcase/access";

/**
 * Проверка кода с формы.
 *
 * Обычный POST с редиректом 303, а не серверная функция: куки должна лежать в
 * ответе, который браузер получит до перехода на закрытую страницу, иначе
 * прокси на этом переходе её ещё не увидит и вернёт на форму. Адрес возврата
 * относительный — за nginx абсолютный собрался бы с внутренним хостом.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const next = safeNext(String(form.get("next") ?? ""));
  const code = accessCode();

  if (!code) return new NextResponse(null, { status: 303, headers: { Location: next } });

  const given = String(form.get("code") ?? "").trim();
  if (!sameSecret(given, code)) {
    const back = `/mavera/access?next=${encodeURIComponent(next)}&error=1`;
    return new NextResponse(null, { status: 303, headers: { Location: back } });
  }

  const response = new NextResponse(null, { status: 303, headers: { Location: next } });
  response.cookies.set(accessCookie(await accessToken(code)));
  return response;
}
