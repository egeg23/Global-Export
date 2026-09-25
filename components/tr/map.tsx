"use client";

import { useCallback, useState } from "react";

import { offices } from "@/content/tr/company";
import { MAP_COLS, MAP_ROWS, WORLD_PATH, project } from "@/content/tr/worldmap";
import { cn } from "@/lib/cn";

/**
 * Карта офисов и сделок.
 *
 * «10 офисов в Евразии» на их сайте — строка мелким текстом. Здесь это
 * сцена: точечная суша, снятая с мозаики NASA, десять городов на своих
 * настоящих координатах и дуги между ними — так рисуют присутствие на
 * биржевых терминалах.
 *
 * Карта — один <path> с заливкой currentColor, поэтому меняет цвет
 * вместе с палитрой и не тащит за собой картинку. Дуги и точки
 * появляются по очереди, когда карта доезжает до кадра: наблюдатель
 * один на всю сцену, очередь держит CSS.
 */
export function OfficeMap() {
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
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const points = offices.map((office) => ({ ...office, ...project(office.lat, office.lon) }));
  // Дуги считаем от Москвы: оттуда родом компания и оттуда идут заявки.
  const hub = points[0];
  const current = points.find((p) => p.id === active) ?? null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)] lg:gap-12">
      <div className="relative overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-3 sm:p-5">
        <svg
          ref={attach}
          viewBox={`0 ${MAP_ROWS * 0.1} ${MAP_COLS} ${MAP_ROWS * 0.76}`}
          data-shown={shown ? "" : undefined}
          className="tr-map w-full"
          role="img"
          aria-label="Карта офисов Tranio: Москва, Афины, Лимасол, Дубай, Стамбул, Барселона, Лиссабон, Берлин, Пхукет, Бали"
        >
          <path d={WORLD_PATH} className="tr-map__land" />

          {points.slice(1).map((point, index) => (
            <path
              key={`arc-${point.id}`}
              d={arc(hub.x, hub.y, point.x, point.y)}
              className="tr-map__arc"
              style={{ "--tr-i": index } as React.CSSProperties}
            />
          ))}

          {points.map((point, index) => (
            <g
              key={point.id}
              className={cn("tr-map__pin", active === point.id && "is-on")}
              style={{ "--tr-i": index } as React.CSSProperties}
              onMouseEnter={() => setActive(point.id)}
              onFocus={() => setActive(point.id)}
            >
              <circle cx={point.x} cy={point.y} r="14" className="tr-map__halo" />
              <circle cx={point.x} cy={point.y} r="5.5" className="tr-map__dot" />
              <circle
                cx={point.x}
                cy={point.y}
                r="22"
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={`${point.city}, ${point.country}`}
                onClick={() => setActive(point.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActive(point.id);
                  }
                }}
                className="cursor-pointer outline-none focus-visible:stroke-[var(--w-accent)] focus-visible:[stroke-width:3]"
              />
            </g>
          ))}
        </svg>
      </div>

      <div>
        {/* Высота карточки закреплена: без этого список под ней прыгал на
            каждое наведение — подпись офиса короче вступительного абзаца, —
            и клик попадал в соседний город. */}
        <div
          aria-live="polite"
          className="min-h-[13.5rem] rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6"
        >
          <p className="tr-eyebrow">{current ? "Офис" : "Присутствие"}</p>
          {current ? (
            <>
              <p className="mt-3 font-[family-name:var(--w-display)] text-[1.5rem] font-semibold text-[var(--w-ink)]">
                {current.city}
              </p>
              <p className="mt-1 text-[0.88rem] text-[var(--w-muted)]">{current.country}</p>
              <p className="tr-figure mt-4 text-[0.82rem] text-[var(--w-muted)]">
                {current.lat.toFixed(2)}° {current.lat >= 0 ? "с.ш." : "ю.ш."} ·{" "}
                {Math.abs(current.lon).toFixed(2)}° {current.lon >= 0 ? "в.д." : "з.д."}
              </p>
            </>
          ) : (
            <>
              <p className="tr-figure mt-3 text-[2.4rem] leading-none text-[var(--w-accent)]">10</p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-[var(--w-muted)]">
                офисов в Евразии, более 2 500 закрытых сделок и более 1 000
                партнёров по всему миру. Наведите на точку — покажем город.
              </p>
            </>
          )}
        </div>

        <ul className="mt-4 grid gap-1">
          {points.map((point) => (
            <li key={point.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(point.id)}
                onFocus={() => setActive(point.id)}
                onClick={() => setActive(point.id)}
                aria-pressed={active === point.id}
                className={cn(
                  "flex w-full cursor-pointer items-baseline justify-between gap-3 rounded-[var(--w-radius)] border px-3.5 py-2 text-left text-[0.84rem] transition-colors",
                  active === point.id
                    ? "border-[var(--w-accent)] bg-[var(--w-accent-soft)]"
                    : "border-transparent text-[var(--w-muted)] hover:border-[var(--w-line)]",
                )}
              >
                <span>{point.city}</span>
                <span className="tr-figure text-[0.76rem] opacity-70">{point.country}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Дуга между двумя точками карты.
 *
 * Прямая линия между Москвой и Бали пересекла бы пол-Азии и читалась бы
 * как граница. Дуга уводит связь вверх и сразу говорит «перелёт», а не
 * «рубеж»; высота подъёма растёт с расстоянием.
 */
function arc(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lift = Math.min(Math.hypot(dx, dy) * 0.32, 170);
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 - lift;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
