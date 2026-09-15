import Image from "next/image";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { formatNumber } from "@/lib/adar/format";
import type { GiftSet } from "@/lib/adar/types";

/**
 * Каталог, разворачивающийся к зрителю.
 *
 * Рамка лежит наклонённой и выравнивается по мере прокрутки — приём, который
 * превращает обычную сетку товаров в кадр. Внутри настоящие позиции
 * каталога, а не картинка-заглушка.
 */
export function CatalogFrame({ showcase }: { showcase: GiftSet[] }) {
  return (
    <section className="bg-adar-green-950">
      <ContainerScroll
        titleComponent={
          <>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-adar-gold-400">
              Каталог
            </p>
            <h2 className="mt-6 font-adar-display text-4xl leading-tight text-adar-cream-50 sm:text-6xl">
              Восемь линеек
              <br />
              <span className="adar-gold-text">в одном кадре</span>
            </h2>
          </>
        }
      >
        <ul className="grid h-full grid-cols-2 gap-px bg-adar-green-900/10 sm:grid-cols-3 md:grid-cols-4">
          {showcase.map((set) => (
            <li
              key={set.slug}
              className="flex flex-col items-center justify-end bg-adar-cream-50 p-3 md:p-4"
            >
              <Image
                src={set.image}
                alt={set.name}
                width={300}
                height={300}
                className="h-full w-auto min-h-0 flex-1 object-contain"
              />
              <p className="mt-2 w-full truncate text-center text-[0.65rem] text-adar-ink-subtle md:text-xs">
                {set.lineLabel}
              </p>
              <p className="text-center text-xs font-medium tabular-nums text-adar-green-800 md:text-sm">
                {formatNumber(set.price)}
              </p>
            </li>
          ))}
        </ul>
      </ContainerScroll>
    </section>
  );
}
