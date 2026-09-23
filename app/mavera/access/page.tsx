import { redirect } from "next/navigation";

import { returnTo, showcaseById } from "@/lib/showcase/access";

const showcase = showcaseById("mavera");

/**
 * Бывшая страница ввода кода. Витрина открыта без кода, но ссылки вида
 * `/mavera/access?next=…` уже разошлись по переписке — они ведут туда, куда
 * вели. Обычно до этой страницы дело не доходит: переадресует прокси
 * (proxy.ts), а это запасной путь на случай, если его обошли.
 */
export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  redirect(returnTo(showcase, Array.isArray(next) ? next[0] : next));
}
