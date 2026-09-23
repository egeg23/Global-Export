import Link from "next/link";

import { cn } from "@/lib/cn";
import { tiers, type TierId } from "@/components/present/mavera/theme";

const hrefs: Record<TierId, string> = {
  standard: "/mavera/standard",
  lux: "/mavera/lux",
  premium: "/mavera/premium",
  noir: "/mavera/noir",
};

/**
 * Полоса поверх каждого варианта: где мы и как перейти к соседнему. Не
 * прилипает к верху — уезжает при первой прокрутке и оставляет первый экран
 * таким, каким его увидит посетитель сайта.
 */
export function VariantBar({ current, admin = false }: { current: TierId; admin?: boolean }) {
  const tier = tiers.find((entry) => entry.id === current) ?? tiers[0];

  return (
    <div className="relative z-50 border-b border-white/10 bg-[#0b0d10] text-[#f2efe9]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 sm:px-8 lg:px-12">
        <Link
          href="/mavera"
          prefetch={false}
          className="group inline-flex items-center gap-2 text-sm text-[#f2efe9]/70 transition-colors hover:text-[#f2efe9]"
        >
          <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Все варианты
        </Link>

        <p className="hidden text-sm text-[#f2efe9]/45 sm:block">
          {tier.label} · {tier.mood} · {tier.duration}
        </p>

        {/* Панель управления в составе варианта: одна на всех, различается блоками. */}
        <Link
          href={admin ? hrefs[current] : `${hrefs[current]}/admin`}
          prefetch={false}
          className={cn(
            "text-sm transition-colors",
            admin ? "text-[#f2efe9]" : "text-[#f2efe9]/60 hover:text-[#f2efe9]",
          )}
        >
          {admin ? "← К сайту" : "Панель управления"}
        </Link>

        <div
          role="tablist"
          aria-label="Варианты сайта"
          className="ml-auto flex flex-wrap items-center gap-1"
        >
          {tiers.map((entry) => {
            const active = entry.id === current;
            return (
              <Link
                key={entry.id}
                href={hrefs[entry.id]}
                prefetch={false}
                role="tab"
                aria-selected={active}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300",
                  active
                    ? "bg-[#f2efe9] text-[#0b0d10]"
                    : "text-[#f2efe9]/60 hover:text-[#f2efe9]",
                )}
              >
                {entry.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
