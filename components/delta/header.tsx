import Image from "next/image";

import { school } from "@/content/delta/school";

const NAV = [
  { href: "#stupeni", label: "Ступени" },
  { href: "#urok", label: "Первый урок" },
  { href: "#deltcoin", label: "Deltcoin" },
  { href: "#roditelyam", label: "Родителям" },
  { href: "#voprosy", label: "Вопросы" },
];

/** Шапка: знак школы, разделы, телефон и одна главная кнопка. */
export function DeltaHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-dl-ink bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="dl-focus flex items-center gap-2.5 rounded-full">
          <Image src="/delta/logo.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-full" priority />
          <span className="font-dl-display text-lg font-black leading-none tracking-tight text-dl-blue">
            DELTA
            <span className="block text-[0.65rem] font-extrabold tracking-[0.08em] text-dl-ink">IT-school</span>
          </span>
        </a>

        <nav aria-label="Разделы" className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="dl-focus rounded-full px-3 py-2 text-sm font-bold text-dl-ink-muted transition-colors hover:bg-dl-sky-100 hover:text-dl-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a href={school.phoneHref} className="dl-focus hidden rounded-full text-sm font-extrabold tabular-nums text-dl-ink sm:block">
            {school.phone}
          </a>
          <a
            href="#zapis"
            className="dl-press dl-focus rounded-full bg-dl-yellow px-4 py-2 text-sm font-extrabold text-dl-ink"
          >
            Пробный урок
          </a>
        </div>
      </div>
    </header>
  );
}
