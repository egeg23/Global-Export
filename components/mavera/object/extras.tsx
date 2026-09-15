import Image from "next/image";

import { Rise } from "@/components/mavera/reveal";
import { cn } from "@/lib/cn";

/**
 * Блоки карточки ЖК, которые продаются отдельно.
 *
 * Серверные, без состояния: их включает и выключает обёртка конструктора,
 * а здесь только разметка. Мир (радиусы, цвета, шрифт) приходит из токенов.
 */

const months = ["Июнь", "Июль", "Август", "Сентябрь"];

/** Фотоотчёт по месяцам — допник «Ход строительства». */
export function Progress({ name, rounded }: { name: string; rounded: string }) {
  return (
    <Rise className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
            Ход строительства
          </p>
          <h2 className="mt-4 text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.1]">
            Готовность 68%
          </h2>
        </div>
        <p className="text-sm text-[var(--w-muted)]">
          ЖК «{name}» · монтаж фасадов, внутренние работы · обновляется каждый месяц
        </p>
      </div>

      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-[var(--w-line)]">
        <span className="block h-full w-[68%] rounded-full bg-[var(--w-accent)]" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {months.map((month, index) => (
          <figure key={month} className={cn("overflow-hidden border border-[var(--w-line)]", rounded)}>
            <div className="relative aspect-[4/3]">
              <Image
                src={index % 2 ? "/images/mavera/construction.jpg" : "/images/mavera/facade.jpg"}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="px-4 py-3 text-sm text-[var(--w-muted)]">{month} 2026</figcaption>
          </figure>
        ))}
      </div>
    </Rise>
  );
}

/** Панорама квартиры — допник «3D-тур». В готовом сайте здесь встраивается Matterport или Kuula. */
export function Tour({ rounded }: { rounded: string }) {
  return (
    <Rise className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">3D-тур</p>
          <h2 className="mt-4 text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.1]">
            Пройдите по квартире до показа
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--w-muted)]">
            Панорама 360° по шоуруму с отделкой: поворачивайте кадр, переходите
            между комнатами, смотрите вид из окна. Снимается за один день на
            готовой квартире.
          </p>
          <p className="mt-6 text-xs leading-relaxed text-[var(--w-muted)]">
            Демонстрация: кадр панорамирует сам. В готовом сайте — встроенный
            просмотрщик тура с управлением мышью и жестами.
          </p>
        </div>

        <div className={cn("relative aspect-[16/9] overflow-hidden lg:col-span-8", rounded)}>
          <Image
            src="/images/mavera/interior.jpg"
            alt="Панорама интерьера квартиры"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="w-pan scale-[1.35] object-cover"
          />
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />
            360°
          </span>
          <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/55 px-4 py-2 text-xs text-white backdrop-blur-sm">
            <span>Гостиная</span>
            <span className="opacity-50">Кухня</span>
            <span className="opacity-50">Спальня</span>
            <span className="opacity-50">Балкон</span>
          </span>
        </div>
      </div>
    </Rise>
  );
}
