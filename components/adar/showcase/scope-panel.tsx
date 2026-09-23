import Link from "next/link";

import { cn } from "@/lib/cn";
import type { Concept } from "@/lib/adar/types";

/**
 * Состав работ по варианту — последний блок каждой страницы-варианта.
 *
 * Отделён от самой концепции тёмной подложкой: всё, что выше, — это макет
 * будущего сайта, а это уже рассказ о том, что в него вложено. Сумм здесь
 * нет: витрина — публичное портфолио, и цены студии на ней не показываются.
 */
export function ScopePanel({ concept }: { concept: Concept }) {
  const { scope } = concept;

  return (
    <section
      id="sostav"
      aria-labelledby="sostav-title"
      className="bg-adar-green-950 text-adar-cream-50"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="border-b border-white/12 pb-8">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-adar-gold-400">
            Состав работ · вариант {concept.index}
          </p>
          <h2
            id="sostav-title"
            className="mt-4 font-adar-display text-4xl leading-none sm:text-5xl"
          >
            «{concept.name}»
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-adar-cream-50/70">
            {concept.tagline}. Срок — {scope.days}.
          </p>
        </div>

        <ol className="mt-4">
          {scope.lines.map((line, index) => (
            <li
              key={line.title}
              className="grid gap-2 border-t border-white/10 py-6 first:border-t-0 sm:grid-cols-[3rem_1fr] sm:gap-6"
            >
              <span
                aria-hidden="true"
                className="font-adar-display text-lg tabular-nums text-adar-gold-300"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-lg text-adar-cream-50">{line.title}</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-adar-cream-50/65">
                  {line.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-10 border-t border-white/12 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="text-sm font-medium text-adar-cream-50">В вариант не входит</h3>
            <p className="mt-3 text-sm leading-relaxed text-adar-cream-50/65">
              Чтобы вопрос не всплыл в середине работы. Любой пункт добавляется
              отдельно, если он нужен.
            </p>
          </div>
          <ul className="grid gap-3 text-sm text-adar-cream-50/70 sm:grid-cols-2 lg:col-span-7">
            {scope.excluded.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="text-adar-cream-50/55">
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Link
            href="/adar"
            prefetch={false}
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-adar-gold-500 px-6 py-3",
              "text-sm font-medium text-adar-green-950 transition-colors duration-300",
              "hover:bg-adar-gold-400",
            )}
          >
            Сравнить с другими вариантами
          </Link>
          <p className="text-sm text-adar-cream-50/65">
            Выбранный вариант дорабатывается до конца — остальные снимаются.
          </p>
        </div>
      </div>
    </section>
  );
}
