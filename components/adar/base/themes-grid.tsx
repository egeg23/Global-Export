import Image from "next/image";

import { Shell } from "@/components/adar/ui/shell";
import { Reveal } from "@/components/ui/reveal";
import { themes } from "@/content/adar/company";
import { pluralize } from "@/lib/adar/format";
import { cn } from "@/lib/cn";

/**
 * Тематические направления.
 *
 * Первое — новогоднее, единственное наполненное, — занимает две ячейки.
 * У пустых направлений честно написано «под заказ»: выдумывать им
 * ассортимент значило бы обещать то, чего у компании в каталоге нет.
 */
export function ThemesGrid({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <section
      id="tematiki"
      className={cn("py-20 lg:py-28", dark && "bg-adar-green-950")}
    >
      <Shell size="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p
              className={cn(
                "text-[0.7rem] font-semibold uppercase tracking-[0.22em]",
                dark ? "text-adar-gold-400" : "text-adar-green-500",
              )}
            >
              Тематические наборы
            </p>
            <h2
              className={cn(
                "mt-4 max-w-xl font-adar-display text-4xl leading-tight sm:text-5xl",
                dark ? "text-adar-cream-50" : "text-adar-green-950",
              )}
            >
              Повод найдётся круглый год
            </h2>
          </div>
          <p
            className={cn(
              "max-w-sm text-sm leading-relaxed",
              dark ? "text-adar-cream-50/55" : "text-adar-ink-muted",
            )}
          >
            Новогодний каталог собран и выложен целиком. Остальные направления
            собираются под задачу: состав, упаковка и бюджет согласуются заранее.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme, index) => (
            <Reveal
              as="li"
              key={theme.slug}
              delay={index * 60}
              className={cn(index === 0 && "sm:col-span-2 lg:row-span-2")}
            >
              <a
                href="#katalog"
                className={cn(
                  "group relative flex h-full min-h-[15rem] flex-col justify-end overflow-hidden rounded-adar p-6",
                  index === 0 && "min-h-[15rem] lg:min-h-[32rem]",
                )}
              >
                <Image
                  src={theme.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-adar-green-950/95 via-adar-green-950/55 to-adar-green-950/15"
                />

                <div className="relative">
                  <h3
                    className={cn(
                      "font-adar-display text-adar-cream-50",
                      index === 0 ? "text-3xl lg:text-4xl" : "text-2xl",
                    )}
                  >
                    {theme.title}
                  </h3>
                  <p className="mt-2 text-sm text-adar-cream-100/70">
                    {theme.count > 0
                      ? pluralize(theme.count, ["набор", "набора", "наборов"]) + " в каталоге"
                      : theme.note}
                  </p>
                  <span
                    className={cn(
                      "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em]",
                      theme.count > 0
                        ? "bg-adar-gold-500 text-adar-green-950"
                        : "border border-adar-cream-50/25 text-adar-cream-50/75",
                    )}
                  >
                    {theme.count > 0 ? "В наличии" : "Под заказ"}
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
      </Shell>
    </section>
  );
}
