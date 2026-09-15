import { SetCard } from "@/components/adar/ui/set-card";
import { Shell } from "@/components/adar/ui/shell";
import { Reveal } from "@/components/ui/reveal";
import { sets } from "@/content/adar/catalog";
import { featuredSets } from "@/lib/adar/catalog";
import { formatNumber, pluralize } from "@/lib/adar/format";
import { priceRange } from "@/lib/adar/catalog";

/**
 * Восемь наборов из разных линеек на главной.
 *
 * На нынешнем сайте в этом блоке четыре позиции подряд из одной ценовой
 * ступени; здесь взяты крайние точки диапазона, чтобы посетитель сразу
 * увидел, что выбор есть и снизу, и сверху.
 */
export function PopularSets() {
  const showcase = featuredSets(8);

  return (
    <section id="katalog" className="bg-adar-cream-100/70 py-20 lg:py-28">
      <Shell size="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-adar-green-500">
              Каталог
            </p>
            <h2 className="mt-4 font-adar-display text-4xl leading-tight text-adar-green-950 sm:text-5xl">
              Популярные наборы
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-adar-ink-muted">
            {pluralize(sets.length, ["набор", "набора", "наборов"])} в восьми
            линейках — от {formatNumber(priceRange.min)} до{" "}
            {formatNumber(priceRange.max)} сум. Состав каждого расписан
            по наименованиям и весу.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {showcase.map((set, index) => (
            <Reveal as="li" key={set.slug} delay={(index % 4) * 70}>
              <SetCard set={set} priority={index < 4} />
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <a
            href="#kontakty"
            className="group inline-flex items-center gap-2 rounded-full border border-adar-green-900/15 bg-white px-7 py-3.5 text-sm font-medium text-adar-green-900 transition-colors duration-300 hover:border-adar-green-900/35"
          >
            Весь каталог — {sets.length} наборов
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </Shell>
    </section>
  );
}
