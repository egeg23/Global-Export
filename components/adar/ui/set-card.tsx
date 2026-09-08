import Image from "next/image";

import { formatPrice, formatWeight, pluralize } from "@/lib/adar/format";
import { cn } from "@/lib/cn";
import type { GiftSet } from "@/lib/adar/types";

type Props = {
  set: GiftSet;
  tone?: "light" | "dark";
  /** Первые карточки на экране грузятся сразу, остальные — по мере прокрутки. */
  priority?: boolean;
  className?: string;
};

/**
 * Карточка набора.
 *
 * Одна на все три концепции: меняется только подложка. Показывает ровно то,
 * по чему выбирают — сколько стоит, сколько весит и сколько внутри
 * наименований, — потому что на нынешнем сайте видна только цена.
 */
export function SetCard({ set, tone = "light", priority = false, className }: Props) {
  const dark = tone === "dark";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-adar border transition-all duration-500",
        dark
          ? "border-white/10 bg-white/[0.03] hover:border-adar-gold-500/40 hover:bg-white/[0.06]"
          : "border-adar-green-900/8 bg-white hover:-translate-y-1 hover:border-adar-green-900/15 hover:shadow-[0_24px_60px_-32px_rgb(16,38,28,0.45)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden",
          dark ? "bg-white/[0.04]" : "bg-adar-cream-100",
        )}
      >
        <Image
          src={set.image}
          alt={set.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
          className="object-contain p-5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <span
          className={cn(
            "absolute left-4 top-4 rounded-full px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em]",
            dark
              ? "bg-adar-gold-500/15 text-adar-gold-300"
              : "bg-adar-green-900/6 text-adar-green-700",
          )}
        >
          {set.lineLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3
          className={cn(
            "text-base leading-snug",
            dark ? "text-adar-cream-50" : "text-adar-ink",
          )}
        >
          {set.name}
        </h3>

        <dl
          className={cn(
            "mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs",
            dark ? "text-adar-cream-50/50" : "text-adar-ink-subtle",
          )}
        >
          <div className="flex gap-1.5">
            <dt className="sr-only">Состав</dt>
            <dd>{pluralize(set.count, ["наименование", "наименования", "наименований"])}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">Вес</dt>
            <dd>{formatWeight(set.weight)}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">Упаковка</dt>
            <dd>{set.pack === "bag" ? "мешок" : "коробка"}</dd>
          </div>
        </dl>

        <p
          className={cn(
            "text-lg font-medium tabular-nums",
            dark ? "text-adar-gold-400" : "text-adar-green-800",
          )}
        >
          {formatPrice(set.price)}
        </p>
      </div>
    </article>
  );
}
