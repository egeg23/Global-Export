import Image from "next/image";

import { school } from "@/content/delta/school";

export function DeltaFooter() {
  return (
    <footer className="border-t-[3px] border-dl-ink bg-dl-ink px-4 py-12 text-white/80 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-start justify-between gap-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <Image src="/delta/logo.webp" alt="" width={44} height={44} className="h-11 w-11 rounded-full" />
            <p className="font-dl-display text-xl font-black text-white">Delta IT-School</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed">{school.claim}.</p>
        </div>

        <ul className="grid gap-2 text-sm font-bold">
          <li>
            <a href={school.phoneHref} className="dl-focus rounded tabular-nums text-white hover:underline">
              {school.phone}
            </a>
          </li>
          <li>
            <a href={school.telegram} target="_blank" rel="noopener" className="dl-focus rounded hover:text-white hover:underline">
              Telegram-канал
            </a>
          </li>
          <li>
            <a href={school.chat} target="_blank" rel="noopener" className="dl-focus rounded hover:text-white hover:underline">
              Чат для родителей
            </a>
          </li>
          <li>
            <a href={school.instagram} target="_blank" rel="noopener" className="dl-focus rounded hover:text-white hover:underline">
              Instagram
            </a>
          </li>
        </ul>
      </div>
      <p className="mx-auto mt-10 w-full max-w-[1240px] text-xs text-white/45">© {new Date().getFullYear()} Delta IT-School</p>
    </footer>
  );
}
