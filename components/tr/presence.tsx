"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { offices } from "@/content/tr/company";
import { BACKDROP, DOT, VIEW_H, VIEW_W, project } from "@/content/tr/geo";
import { places, placeOf, shown } from "@/content/tr/presence";
import { cn } from "@/lib/cn";

/**
 * Карта присутствия во весь экран.
 *
 * Раньше здесь была карта всего мира в точку: половину кадра занимали
 * Тихий океан и обе Америки, где компании нет, а Кипр, где у неё сделки,
 * был меньше точки. Теперь кадр обрезан по региону присутствия —
 * от Португалии до Бали, — страны нарисованы настоящими контурами, и
 * любую можно зажечь наведением или пальцем.
 *
 * Разметка одна на все ширины, раскладка разная. На большом экране карта
 * лежит фоном во весь экран, а заголовок и карточка плавают поверх неё в
 * пустых углах — в Атлантике и в Индийском океане. На телефоне то же
 * самое становится колонкой: заголовок, карта, лента фишек, карточка.
 * Фишки нужны именно там: Кипр на ширине телефона — восемь пикселей, и
 * пальцем в него не попасть.
 *
 * Выбор держится в двух состояниях. `hover` — наведение мышью, живёт,
 * пока курсор на стране. `pinned` — нажатие или фишка, живёт, пока не
 * выбрали другую. Показывается первое из двух, поэтому мышь перебивает
 * закреплённое, а палец, у которого наведения нет, работает нажатием.
 */
export function Presence() {
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const chips = useRef<HTMLDivElement>(null);

  const attach = useCallback((node: SVGSVGElement | null) => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setReady(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const activeId = hover ?? pinned;
  const active = activeId ? (placeOf.get(activeId) ?? null) : null;

  // Выбранная фишка подъезжает к середине ленты: на телефоне выбор часто
  // приходит с карты, и фишка выбранной страны оказывалась за краем.
  useEffect(() => {
    if (!pinned) return;
    const node = chips.current?.querySelector<HTMLElement>(
      `[data-chip="${pinned}"]`,
    );
    node?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [pinned]);

  const pick = (id: string) => setPinned((prev) => (prev === id ? null : id));

  // Шапка страницы липкая и съедает верх экрана, поэтому «на весь экран»
  // здесь — это экран за вычетом шапки: так нижний край карточки
  // приходится ровно на сгиб, а не уезжает под него.
  return (
    <section
      id="map"
      className="relative isolate flex min-h-[calc(100svh-4rem)] scroll-mt-16 flex-col gap-3 bg-[var(--w-paper)] px-5 py-5 sm:px-8 lg:block lg:min-h-[calc(100svh-4.25rem)] lg:overflow-hidden lg:px-0 lg:py-0"
    >
      {/* Карта. На большом экране занимает правые две трети, на телефоне —
          средний ряд колонки, который забирает остаток высоты. Заголовок
          поверх карты не кладём: он накрыл бы Европу, а там как раз всё
          самое частое — Испания, Греция, Кипр, Турция. */}
      <div className="relative order-2 min-h-[13rem] flex-1 lg:absolute lg:inset-y-0 lg:right-0 lg:left-[23rem] lg:order-none">
        <svg
          ref={attach}
          viewBox={`-26 -22 ${VIEW_W + 52} ${VIEW_H + 44}`}
          preserveAspectRatio="xMidYMid meet"
          data-shown={ready ? "" : undefined}
          className="tr-geo absolute inset-0 h-full w-full"
          role="img"
          aria-label={`Карта присутствия: ${shown.offices} офисов и ${shown.directions} направлений от Португалии до Бали`}
        >
          <path
            d={BACKDROP}
            className="tr-geo__dots"
            style={{ strokeWidth: DOT * 2 } as React.CSSProperties}
          />

          {places.map((place, index) => {
            const on = activeId === place.id;
            const label = [
              place.name,
              place.offices.length ? "— офис" : "",
              "направление",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <g
                key={place.id}
                className={cn("tr-geo__place", on && "is-on")}
                style={{ "--tr-i": index } as React.CSSProperties}
                onMouseEnter={() => setHover(place.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => pick(place.id)}
              >
                <path d={place.d} className="tr-geo__shape" />
                {/* Обводка прозрачным пером шире контура: у Кипра и
                      Черногории площадь меньше пальца, и без этого запаса
                      в них не попасть ни мышью, ни касанием. */}
                <path
                  d={place.d}
                  className="tr-geo__hit"
                  tabIndex={0}
                  role="button"
                  aria-label={label}
                  aria-pressed={pinned === place.id}
                  onFocus={() => setHover(place.id)}
                  onBlur={() => setHover(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      pick(place.id);
                    }
                  }}
                />
              </g>
            );
          })}

          {offices.map((office, index) => {
            const point = project(office.lat, office.lon);
            const on = activeId === office.country;
            return (
              <g
                key={office.id}
                className={cn("tr-geo__pin", on && "is-on")}
                style={{ "--tr-i": index } as React.CSSProperties}
                onMouseEnter={() => setHover(office.country)}
                onMouseLeave={() => setHover(null)}
                onClick={() => pick(office.country)}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="11"
                  className="tr-geo__ping"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  className="tr-geo__dot"
                />
                <text x={point.x} y={point.y - 16} className="tr-geo__city">
                  {office.city}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <header className="order-1 lg:absolute lg:top-14 lg:left-8 lg:w-[19rem]">
        <p className="tr-eyebrow">Раздел 03</p>
        <h2 className="mt-2 font-[family-name:var(--w-display)] text-[clamp(1.45rem,3.4vw,2.4rem)] font-semibold leading-[1.1] text-[var(--w-ink)]">
          Десять офисов и двадцать{" "}
          <span className="text-[var(--w-accent)]">направлений</span> на одной
          карте
        </h2>
        <p className="mt-3 text-[0.88rem] leading-relaxed text-[var(--w-muted)]">
          Залиты страны, где мы работаем. Точка — наш офис. Наведите или
          коснитесь страны: покажем адрес, порог входа и доходность.
        </p>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {[
            [shown.offices, "офисов"],
            [shown.directions, "направлений в кадре"],
            [2500, "закрытых сделок"],
          ].map(([value, label]) => (
            <div key={String(label)}>
              <dt className="tr-figure text-[1.15rem] leading-none text-[var(--w-accent)]">
                {value === 2500 ? "2 500" : value}
              </dt>
              <dd className="mt-1 text-[0.72rem] text-[var(--w-muted)]">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Лента фишек: на телефоне это главный способ выбрать страну —
          Кипр на такой ширине восемь пикселей, пальцем в него не попасть. */}
      <div
        ref={chips}
        className="order-3 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:hidden"
      >
        {places.map((place) => (
          <button
            key={place.id}
            type="button"
            data-chip={place.id}
            aria-pressed={activeId === place.id}
            onClick={() => pick(place.id)}
            className={cn(
              "shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.82rem] whitespace-nowrap transition-colors",
              activeId === place.id
                ? "border-[var(--w-accent)] bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
                : "border-[var(--w-line)] bg-[var(--w-surface)] text-[var(--w-muted)]",
            )}
          >
            {place.offices.length > 0 ? `${place.name} · офис` : place.name}
          </button>
        ))}
      </div>

      {/* Карточка выбранного. */}
      <aside
        aria-live="polite"
        className="order-4 rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-4 shadow-[var(--w-shadow)] lg:absolute lg:bottom-14 lg:left-8 lg:w-[19rem] lg:p-6"
      >
        {active ? (
          <>
            <p className="tr-eyebrow">
              {active.offices.length > 0 ? "Офис и направление" : "Направление"}
            </p>
            <h3 className="mt-2.5 font-[family-name:var(--w-display)] text-[1.5rem] font-semibold leading-tight text-[var(--w-ink)]">
              {active.name}
            </h3>

            {active.offices.length > 0 ? (
              <ul className="mt-4 grid gap-3">
                {active.offices.map((office) => (
                  <li key={office.id}>
                    <p className="text-[0.9rem] font-medium text-[var(--w-ink)]">
                      {office.city}
                    </p>
                    <p className="tr-figure mt-1 text-[0.78rem] leading-snug text-[var(--w-muted)]">
                      {office.address}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[0.86rem] leading-relaxed text-[var(--w-muted)]">
                Своего офиса здесь нет — работаем с партнёрами на месте, их у
                нас больше тысячи.
              </p>
            )}

            {active.country ? (
              <>
                <dl className="mt-5 grid gap-2 border-t border-[var(--w-line)] pt-4">
                  <div className="flex items-baseline gap-3">
                    <dt className="text-[0.82rem] text-[var(--w-muted)]">
                      Вход от
                    </dt>
                    <span className="tr-dots" aria-hidden />
                    <dd className="tr-figure shrink-0 text-[0.92rem] text-[var(--w-ink)]">
                      €{active.country.entry} тыс.
                    </dd>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <dt className="text-[0.82rem] text-[var(--w-muted)]">
                      Доходность
                    </dt>
                    <span className="tr-dots" aria-hidden />
                    <dd className="tr-figure tr-yield shrink-0 text-[0.92rem]">
                      {active.country.yield[0]}—{active.country.yield[1]}%
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-[0.8rem] leading-relaxed text-[var(--w-muted)]">
                  {active.country.cities
                    .slice(0, 4)
                    .map((city) => city.name)
                    .join(" · ")}
                </p>
              </>
            ) : (
              <p className="mt-5 border-t border-[var(--w-line)] pt-4 text-[0.8rem] leading-relaxed text-[var(--w-muted)]">
                Отсюда идут заявки: направление подбираем по всему каталогу.
              </p>
            )}
          </>
        ) : (
          <>
            <p className="tr-eyebrow">Присутствие</p>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-[var(--w-ink)]">
              От Торревьехи до Бали: десять офисов в восьми странах и двадцать
              направлений каталога в одном кадре.
            </p>
            <p className="mt-3 text-[0.8rem] leading-relaxed text-[var(--w-muted)]">
              {shown.outside.length > 0
                ? `${shown.outside.join(", ")} — тоже в каталоге, но за краем этого кадра.`
                : null}{" "}
              Выберите страну, чтобы увидеть адрес и цифры по ней.
            </p>
          </>
        )}
      </aside>
    </section>
  );
}
