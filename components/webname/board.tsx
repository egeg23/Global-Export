"use client";

import { useEffect, useState } from "react";

import { useSearch } from "@/components/webname/hero";
import { Icon } from "@/components/webname/icons";
import { reducedMotion, useOnScreen } from "@/components/webname/motion";
import { contacts, freedDomains } from "@/content/webname/facts";

const ROWS = 5;
const WIDTH = Math.max(...freedDomains.map((domain) => domain.length));

/**
 * Табло освободившихся доменов — как в аэропорту. Список настоящий: его
 * Arsenal D публикует на главной и в Telegram-канале. Каждые несколько
 * секунд одна строка перелистывается на следующий домен; ячейки
 * поворачиваются вокруг горизонтальной оси (только transform). Вне экрана и
 * при «уменьшить движение» табло стоит.
 */
export function FreeBoard() {
  const search = useSearch();
  const [wrap, visible] = useOnScreen<HTMLDivElement>("0px");
  const [rows, setRows] = useState(() => freedDomains.slice(0, ROWS));

  // Раз в пару секунд одна строка табло перелистывается на следующий домен
  // из списка; ключи ячеек меняются только у неё — она одна и щёлкает.
  useEffect(() => {
    if (!visible || reducedMotion()) return;
    let row = 0;
    let next = ROWS;
    const timer = window.setInterval(() => {
      const index = row;
      const domain = freedDomains[next % freedDomains.length];
      setRows((current) => current.map((value, at) => (at === index ? domain : value)));
      row = (row + 2) % ROWS;
      next += 1;
    }, 2600);
    return () => window.clearInterval(timer);
  }, [visible]);

  return (
    <section id="board" className="wn-dark scroll-mt-20">
      <div ref={wrap} className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <h2 className="wn-display text-4xl sm:text-5xl">Только что освободились</h2>
          <p className="wn-muted mt-4 max-w-sm">
            Домены, которые владельцы не продлили. Нравится имя — нажмите «Занять», и оно встанет в поиск.
          </p>
          <a
            href={`https://t.me/${contacts.freeChannel}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl px-1 font-bold text-wn-sky-bright underline-offset-4 hover:underline"
          >
            <Icon name="brand-telegram" className="h-5 w-5" />
            Канал @{contacts.freeChannel}
          </a>
        </div>
        <ol className="space-y-2 lg:col-span-8" aria-label="Освободившиеся домены">
          {rows.map((domain, row) => {
            return (
              <li key={row} className="flex items-center gap-2 rounded-xl bg-[#0f1a52] p-2 sm:gap-3">
                <span className="sr-only">{domain}</span>
                <span aria-hidden="true" className="flex min-w-0 flex-1 gap-[2px]">
                  {domain
                    .padEnd(WIDTH, " ")
                    .slice(0, WIDTH)
                    .split("")
                    .map((char, index) => (
                      <span
                        key={`${domain}-${index}`}
                        className="wn-mono wn-flap flex h-9 min-w-0 flex-1 items-center justify-center rounded-[3px] bg-[#0a1240] text-xs font-bold text-wn-amber sm:h-11 sm:max-w-8 sm:text-lg"
                        style={{ "--c": index } as React.CSSProperties}
                      >
                        {char === " " ? "" : char}
                      </span>
                    ))}
                </span>
                <button
                  type="button"
                  onClick={() => search.set(domain.replace(/\.uz$/, ""), "board")}
                  className="min-h-11 shrink-0 rounded-lg bg-wn-amber px-3 text-sm font-bold text-wn-ink transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
                  aria-label={`Занять ${domain}`}
                >
                  Занять
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
