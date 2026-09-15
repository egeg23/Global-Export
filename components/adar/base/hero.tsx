import Image from "next/image";
import Link from "next/link";

import { Shell } from "@/components/adar/ui/shell";
import { sets } from "@/content/adar/catalog";
import { company } from "@/content/adar/company";
import { featuredSets, priceRange } from "@/lib/adar/catalog";
import { formatNumber, formatPrice } from "@/lib/adar/format";

const figures = [
  { value: `${sets.length}`, label: "готовых наборов в каталоге" },
  { value: "100+", label: "видов упаковки" },
  { value: `от ${formatNumber(priceRange.min)}`, label: "сум за набор" },
];

/**
 * Первый экран.
 *
 * Слева — обещание и два действия, справа — их собственная фотография
 * витрины. Ценник конкретного набора лежит на стыке колонок: посетитель
 * видит товар и цену, не пролистав ни пикселя.
 */
export function Hero() {
  // Один набор из середины каталога — тот, что показывается ценником.
  const showcase = featuredSets(1)[0];

  return (
    <section className="relative overflow-hidden pb-16 pt-12 lg:pb-24 lg:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full bg-adar-gold-200/35 blur-3xl"
      />

      <Shell size="wide" className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 xl:col-span-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-adar-green-500">
            Подарочные наборы · Ташкент · с {company.since} года
          </p>

          <h1 className="mt-6 font-adar-display text-[2.75rem] leading-[1.02] text-adar-green-950 sm:text-6xl xl:text-7xl">
            Выберите идеальный подарок для любого повода
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-relaxed text-adar-ink-muted">
            {company.about} Собираем от одной коробки до партии на пять тысяч
            человек — с вашим логотипом на крышке.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="#katalog"
              className="rounded-full bg-adar-green-900 px-7 py-3.5 text-sm font-medium text-adar-cream-50 transition-colors duration-300 hover:bg-adar-green-800"
            >
              Смотреть каталог
            </Link>
            <Link
              href="#kontakty"
              className="rounded-full border border-adar-green-900/15 px-7 py-3.5 text-sm font-medium text-adar-green-900 transition-colors duration-300 hover:border-adar-green-900/35 hover:bg-white"
            >
              Рассчитать партию
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-adar-green-900/10 pt-8">
            {figures.map((figure) => (
              <div key={figure.label}>
                <dt className="sr-only">{figure.label}</dt>
                <dd>
                  <span className="block font-adar-display text-3xl text-adar-green-800">
                    {figure.value}
                  </span>
                  <span className="mt-1.5 block text-xs leading-snug text-adar-ink-subtle">
                    {figure.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7 xl:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-adar-lg">
            <Image
              src="/adar/photos/adar-bags.webp"
              alt="Фирменные пакеты ADAR у новогоднего камина"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Ценник поверх фотографии: витрина показывает не настроение,
              а конкретный набор с конкретной ценой. */}
          <figure className="absolute -bottom-8 -left-6 hidden w-72 items-center gap-4 rounded-adar bg-adar-cream-50 p-3 shadow-[0_30px_60px_-30px_rgba(16,38,28,0.5)] lg:flex xl:-left-14">
            <Image
              src={showcase.image}
              alt={showcase.name}
              width={220}
              height={220}
              priority
              className="h-20 w-20 shrink-0 object-contain"
            />
            <figcaption className="min-w-0">
              <span className="block text-[0.65rem] uppercase tracking-[0.16em] text-adar-gold-600">
                {showcase.lineLabel}
              </span>
              <span className="mt-1 block truncate text-sm text-adar-ink">{showcase.name}</span>
              <span className="mt-1 block text-base font-medium tabular-nums text-adar-green-800">
                {formatPrice(showcase.price)}
              </span>
            </figcaption>
          </figure>
        </div>
      </Shell>
    </section>
  );
}
