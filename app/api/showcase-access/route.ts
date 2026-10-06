import { NextResponse } from "next/server";

import { grantCookie, grantFor, returnTo, showcaseFor, showcases } from "@/lib/showcase/access";

/**
 * Проверка кода с формы закрытой витрины.
 *
 * Обычный POST с редиректом 303, а не серверная функция: куки должна лежать в
 * ответе, который браузер получит до перехода на закрытую страницу, иначе
 * прокси на этом переходе её ещё не увидит и вернёт на форму. Адрес возврата
 * относительный — за nginx абсолютный собрался бы с внутренним хостом — и
 * только свой, внутри витрины (returnTo).
 *
 * Какая витрина — видно по адресу возврата: его префикс выбирает и код, и
 * куки, и страницу, куда вернуть при ошибке.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const raw = String(form.get("next") ?? "");
  const showcase = (raw.startsWith("/") ? showcaseFor(raw.split(/[?#]/)[0]) : null) ?? showcases[0];
  const next = returnTo(showcase, raw);
  const granted = await grantFor(showcase, String(form.get("code") ?? ""));

  if (!granted) {
    const back = `${showcase.gate}?next=${encodeURIComponent(next)}&error=1`;
    return new NextResponse(null, { status: 303, headers: { Location: back } });
  }

  const response = new NextResponse(null, { status: 303, headers: { Location: next } });
  response.cookies.set(grantCookie(granted));
  return response;
}
