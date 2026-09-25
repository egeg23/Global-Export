"use client";

import { useCallback, useState } from "react";

import { useT } from "@/components/tt/lang";
import { branches } from "@/content/tt/company";
import { KZ_H, KZ_W, links, place, shownKm } from "@/content/tt/kzmap";
import { cn } from "@/lib/cn";

/**
 * Схема магистральной сети.
 *
 * «15 000 км ВОЛС во всех регионах РК» — их главный физический актив, и
 * на их сайте он существует одной строкой в разделе истории. Здесь это
 * сцена: четырнадцать филиалов на настоящих координатах, магистрали
 * между ними и настоящее расстояние по дуге большого круга под каждым
 * плечом.
 *
 * Границы страны на схеме нет намеренно: это схема сети, а не карта
 * границ, и приблизительная линия, выданная за границу государства,
 * здесь была бы хуже, чем её отсутствие.
 *
 * Волокно зажигается по очереди от Астаны, когда схема доезжает до
 * кадра: один наблюдатель, очередь держит CSS.
 */
export function Network() {
  const t = useT();
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const attach = useCallback((node: SVGSVGElement | null) => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const current = branches.find((branch) => branch.id === active) ?? null;
  const touching = links.filter((link) => link.from === active || link.to === active);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.5fr)] lg:gap-12">
      <div className="tt-grid overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-paper)] p-3 sm:p-5">
        <svg
          ref={attach}
          viewBox={`-40 -30 ${KZ_W + 80} ${KZ_H + 60}`}
          data-shown={shown ? "" : undefined}
          className="tt-net w-full"
          role="img"
          aria-label={t({
            ru: "Схема магистральной сети: четырнадцать филиалов и магистрали между ними",
            kk: "Магистральдық желі схемасы: он төрт филиал және олардың арасындағы магистральдар",
          })}
        >
          {links.map((link, index) => (
            <g key={link.id}>
              <path
                d={`M${link.a.x.toFixed(1)} ${link.a.y.toFixed(1)}L${link.b.x.toFixed(1)} ${link.b.y.toFixed(1)}`}
                className="tt-fibre"
                data-live={
                  shown && (active === null || link.from === active || link.to === active)
                    ? ""
                    : undefined
                }
                style={{ "--tt-i": index } as React.CSSProperties}
              />
              <text
                x={(link.a.x + link.b.x) / 2}
                y={(link.a.y + link.b.y) / 2 - 6}
                textAnchor="middle"
                className="tt-net__km"
              >
                {link.km}
              </text>
            </g>
          ))}

          {branches.map((branch, index) => {
            const point = place(branch.lat, branch.lon);
            const on = active === branch.id;
            return (
              <g
                key={branch.id}
                className={cn("tt-net__node", on && "is-on")}
                style={{ "--tt-i": index } as React.CSSProperties}
                onMouseEnter={() => setActive(branch.id)}
                onMouseLeave={() => setActive(null)}
              >
                <circle cx={point.x} cy={point.y} r={branch.hub ? 9 : 6} className="tt-net__dot" />
                {/* Подписи соседних узлов налезали друг на друга — у
                    тесных городов сдвиг задан в данных, а не подобран
                    глазами по одному разрешению экрана. */}
                <text
                  x={point.x + (branch.label === "left" ? -12 : branch.label === "right" ? 12 : 0)}
                  y={
                    branch.label === "below"
                      ? point.y + (branch.hub ? 26 : 23)
                      : branch.label === "left" || branch.label === "right"
                        ? point.y + 5
                        : point.y - (branch.hub ? 16 : 13)
                  }
                  textAnchor={
                    branch.label === "left" ? "end" : branch.label === "right" ? "start" : "middle"
                  }
                  className="tt-net__label"
                >
                  {t(branch.name)}
                </text>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="24"
                  fill="transparent"
                  tabIndex={0}
                  role="button"
                  aria-label={t(branch.name)}
                  onFocus={() => setActive(branch.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(branch.id)}
                  className="cursor-pointer outline-none focus-visible:stroke-[var(--w-accent)] focus-visible:[stroke-width:3]"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div>
        <div
          aria-live="polite"
          className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6"
        >
          {current ? (
            <>
              <p className="tt-signal">{t({ ru: "Филиал", kk: "Филиал" })}</p>
              <p className="mt-3 font-[family-name:var(--w-display)] text-[1.5rem] font-bold text-[var(--w-ink)]">
                {t(current.name)}
              </p>
              <ul className="mt-4 grid gap-1.5">
                {touching.map((link) => {
                  const other = branches.find(
                    (branch) => branch.id === (link.from === active ? link.to : link.from),
                  );
                  return (
                    <li
                      key={link.id}
                      className="flex items-baseline justify-between gap-3 text-[0.84rem]"
                    >
                      <span className="text-[var(--w-muted)]">{other ? t(other.name) : ""}</span>
                      <span className="tt-figure text-[var(--w-accent)]">{link.km} км</span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              <p className="tt-signal">{t({ ru: "Магистраль", kk: "Магистраль" })}</p>
              <p className="tt-figure mt-3 text-[2.4rem] leading-none text-[var(--w-accent)]">
                15 000
              </p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-[var(--w-muted)]">
                {t({
                  ru: "километров волоконно-оптических линий во всех регионах Казахстана. Наведите на узел, чтобы увидеть плечи.",
                  kk: "Қазақстанның барлық аймағындағы талшықты-оптикалық желі километрі. Иықтарды көру үшін түйінге меңзеңіз.",
                })}
              </p>
            </>
          )}
        </div>

        <p className="mt-4 text-[0.78rem] leading-relaxed text-[var(--w-muted)]">
          {t({
            ru: `На схеме — ${links.length} основных плеч между филиалами общей длиной ${shownKm.toLocaleString("ru-RU")} км. Магистраль идёт вдоль железной дороги: мы выросли из КТЖ и вышли из её состава.`,
            kk: `Схемада филиалдар арасындағы ${links.length} негізгі иық, жалпы ұзындығы ${shownKm.toLocaleString("ru-RU")} км. Магистраль теміржол бойымен жүреді: біз ҚТЖ құрамынан өсіп, кейін оның құрамынан шықтық.`,
          })}
        </p>
      </div>
    </div>
  );
}
