import Image from "next/image";

import { Shell } from "@/components/adar/ui/shell";
import { clients } from "@/content/adar/company";
import { cn } from "@/lib/cn";

/**
 * Логотипы заказчиков.
 *
 * Самый сильный аргумент компании и единственный блок, который на нынешнем
 * сайте выглядит убедительно.
 *
 * Гербы и знаки нарисованы для белого фона: у части из них белая подложка
 * впечатана в файл. Поэтому на светлой версии они лежат в сплошной сетке
 * белых ячеек, а на тёмной — на отдельных светлых плашках. Перекрашивать их
 * в белое нельзя: сложные знаки после инверсии превращаются в пятна.
 */
export function ClientsWall({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const columns = 5;
  const remainder = (columns - (clients.length % columns)) % columns;

  return (
    <section className={cn("py-20 lg:py-24", dark ? "bg-adar-green-950" : "bg-adar-cream-100/70")}>
      <Shell size="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2
            className={cn(
              "font-adar-display text-3xl leading-tight sm:text-4xl",
              dark ? "text-adar-cream-50" : "text-adar-green-950",
            )}
          >
            Нас выбирают комбинаты, министерства и заводы
          </h2>
          <p
            className={cn(
              "max-w-sm text-sm leading-relaxed",
              dark ? "text-adar-cream-50/55" : "text-adar-ink-muted",
            )}
          >
            Первая крупная отгрузка — 24 000 подарков для Алмалыкского ГМК.
            С тех пор счёт идёт на десятки тысяч комплектов в сезон.
          </p>
        </div>

        <ul
          className={cn(
            "mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
            dark ? "gap-3" : "gap-px overflow-hidden rounded-adar bg-adar-green-900/10",
          )}
        >
          {clients.map((client) => (
            <li
              key={client.name}
              className={cn(
                "flex items-center justify-center bg-white p-6",
                dark && "rounded-xl",
              )}
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={160}
                height={80}
                className="h-14 w-auto object-contain opacity-80 transition-opacity duration-500 hover:opacity-100"
              />
            </li>
          ))}
          {/* Тринадцать логотипов в сетке из пяти колонок оставляют дыры в
              последнем ряду. В светлой версии сквозь них просвечивает
              разделительная подложка, поэтому дыры закрываются пустыми
              ячейками; в тёмной плашки и так стоят раздельно. */}
          {!dark
            ? Array.from({ length: remainder }, (_, index) => (
                <li key={`filler-${index}`} aria-hidden="true" className="hidden bg-white lg:block" />
              ))
            : null}
        </ul>
      </Shell>
    </section>
  );
}
