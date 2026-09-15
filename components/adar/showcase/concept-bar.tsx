import Link from "next/link";

import { concepts } from "@/content/adar/concepts";
import { cn } from "@/lib/cn";
import type { Concept } from "@/lib/adar/types";

/**
 * Полоса поверх каждой концепции: где мы находимся, сколько это стоит и как
 * перейти к соседнему варианту.
 *
 * Не закреплена сверху намеренно — уезжает при первой же прокрутке и
 * оставляет первый экран концепции таким, каким его увидит посетитель сайта.
 */
export function ConceptBar({ current }: { current: Concept["id"] }) {
  return (
    <div className="relative z-50 border-b border-white/10 bg-adar-green-950 text-adar-cream-50">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 sm:px-8 lg:px-12">
        <Link
          href="/adar"
          prefetch={false}
          className="group inline-flex items-center gap-2 text-sm text-adar-cream-50/70 transition-colors hover:text-adar-cream-50"
        >
          <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Все варианты
        </Link>

        <div
          role="tablist"
          aria-label="Варианты оформления"
          className="ml-auto flex flex-wrap items-center gap-1"
        >
          {concepts.map((concept) => {
            const active = concept.id === current;
            return (
              <Link
                key={concept.id}
                href={concept.href}
                prefetch={false}
                role="tab"
                aria-selected={active}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300",
                  active
                    ? "bg-adar-gold-500 font-medium text-adar-green-950"
                    : "text-adar-cream-50/55 hover:bg-white/8 hover:text-adar-cream-50",
                )}
              >
                <span className="mr-1.5 text-[0.7rem] opacity-60">{concept.index}</span>
                {concept.name}
                <span className="ml-2 tabular-nums opacity-70">${concept.estimate.total}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
