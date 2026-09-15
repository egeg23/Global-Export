import Link from "next/link";

import { cn } from "@/lib/cn";
import type { Concept } from "@/lib/adar/types";

/**
 * Смета по концепции — последний блок каждой страницы-варианта.
 *
 * Отделена от самой концепции тёмной подложкой: всё, что выше, — это макет
 * будущего сайта, а это уже разговор о деньгах, и путать их не нужно.
 * Строки складываются в итог на виду у заказчика, без «прочих работ».
 */
export function EstimatePanel({ concept }: { concept: Concept }) {
  const { estimate } = concept;

  return (
    <section
      id="smeta"
      aria-labelledby="smeta-title"
      className="bg-adar-green-950 text-adar-cream-50"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/12 pb-8">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-adar-gold-400">
              Смета · вариант {concept.index}
            </p>
            <h2
              id="smeta-title"
              className="mt-4 font-adar-display text-4xl leading-none sm:text-5xl"
            >
              «{concept.name}»
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-adar-cream-50/65">
              {concept.tagline}. Срок — {estimate.days}.
            </p>
          </div>

          <p className="text-right">
            <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-adar-cream-50/45">
              Итого
            </span>
            <span className="mt-1 block font-adar-display text-6xl leading-none text-adar-gold-400 tabular-nums sm:text-7xl">
              ${estimate.total}
            </span>
          </p>
        </div>

        <table className="mt-10 w-full border-collapse text-left">
          <caption className="sr-only">
            Состав работ и стоимость по варианту «{concept.name}»
          </caption>
          <thead>
            <tr className="text-[0.7rem] uppercase tracking-[0.18em] text-adar-cream-50/40">
              <th scope="col" className="pb-4 font-medium">
                Работа
              </th>
              <th scope="col" className="pb-4 text-right font-medium">
                Стоимость
              </th>
            </tr>
          </thead>
          <tbody>
            {estimate.lines.map((line) => (
              <tr key={line.title} className="border-t border-white/10 align-top">
                <th scope="row" className="py-6 pr-8 text-left font-normal">
                  <span className="block text-lg text-adar-cream-50">{line.title}</span>
                  <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-adar-cream-50/55">
                    {line.detail}
                  </span>
                </th>
                <td className="whitespace-nowrap py-6 text-right text-lg tabular-nums text-adar-gold-300">
                  ${line.price}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-adar-gold-500/40">
              <th scope="row" className="py-6 text-left text-lg font-medium">
                Итого
              </th>
              <td className="py-6 text-right text-2xl font-medium tabular-nums text-adar-gold-400">
                ${estimate.total}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-14 grid gap-10 border-t border-white/12 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="text-sm font-medium text-adar-cream-50">В сумму не входит</h3>
            <p className="mt-3 text-sm leading-relaxed text-adar-cream-50/50">
              Чтобы вопрос не всплыл в середине работы. Любой пункт добавляется
              отдельной строкой, если он нужен.
            </p>
          </div>
          <ul className="grid gap-3 text-sm text-adar-cream-50/70 sm:grid-cols-2 lg:col-span-7">
            {estimate.excluded.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="text-adar-cream-50/30">
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
          <p className="text-sm text-adar-cream-50/45">
            Выбранный вариант дорабатывается до конца — остальные снимаются.
          </p>
        </div>
      </div>
    </section>
  );
}
