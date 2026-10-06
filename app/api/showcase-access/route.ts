import { NextResponse } from "next/server";

import { accessCookie, checkCode, returnTo, showcaseById } from "@/lib/showcase/access";

const showcase = showcaseById("mavera");

/**
 * Проверка кода с формы MAVERA.
 *
 * Обычный POST с редиректом 303, а не серверная функция: куки должна лежать в
 * ответе, который браузер получит до перехода на закрытую страницу, иначе
 * прокси на этом переходе её ещё не увидит и вернёт на форму. Адрес возврата
 * относительный — за nginx абсолютный собрался бы с внутренним хостом — и
 * только свой, внутри витрины (returnTo).
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const next = returnTo(showcase, String(form.get("next") ?? ""));
  const key = await checkCode(String(form.get("code") ?? ""));

  if (!key) {
    const back = `${showcase.gate}?next=${encodeURIComponent(next)}&error=1`;
    return new NextResponse(null, { status: 303, headers: { Location: back } });
  }

  const response = new NextResponse(null, { status: 303, headers: { Location: next } });
  response.cookies.set(accessCookie(key));
  return response;
}
