import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { accessCode, safeNext } from "@/lib/showcase/access";

export const metadata: Metadata = { title: "Доступ к витрине" };

/**
 * Страница ввода кода.
 *
 * Сюда попадает всякий, у кого нет куки: заказчик по ссылке с ключом её не
 * увидит, а случайный посетитель — только её. Оформление наше, витринное:
 * это не часть сайта MAVERA.
 */
export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (!accessCode()) redirect(next);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0d10] px-5 py-16 text-sand-50">
      <div className="w-full max-w-md">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-harvest-300">
          Витрина · MAVERA
        </p>
        <h1 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">Закрытый показ</h1>
        <p className="mt-4 text-sm leading-relaxed text-sand-200/70">
          Три варианта сайта, панель управления и смета показываются по коду.
          Код есть в ссылке, которую вам отправили; если ссылка без кода — введите
          его вручную.
        </p>

        <form
          method="post"
          action="/api/showcase-access"
          className="mt-8 rounded-card border border-sand-50/12 bg-forest-950 p-6 sm:p-7"
        >
          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="text-[0.65rem] uppercase tracking-[0.16em] text-sand-300/60">Код доступа</span>
            <input
              name="code"
              type="password"
              autoComplete="off"
              autoFocus
              required
              className="mt-2 w-full rounded-lg border border-sand-50/15 bg-[#0b0d10] px-4 py-3 text-base text-sand-50 outline-none transition-colors focus:border-harvest-300"
            />
          </label>
          {params.error ? (
            <p role="alert" className="mt-3 text-sm text-[#ffb4a2]">
              Код не подошёл. Проверьте ссылку или запросите код у студии.
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-harvest-300 px-5 py-3 text-sm font-medium text-forest-950 transition-opacity hover:opacity-90"
          >
            Открыть витрину
          </button>
        </form>

        <p className="mt-8 text-xs leading-relaxed text-sand-300/45">
          © 2026 Maximov Tech. Макеты, тексты и код витрины защищены авторским
          правом и показываются только заказчику. Копирование и передача третьим
          лицам без согласия студии запрещены.
        </p>
      </div>
    </main>
  );
}
