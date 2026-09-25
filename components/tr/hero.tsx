"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { PaletteSwitch } from "@/components/showcase/palette";
import { useStage } from "@/components/showcase/depth";
import { company, stats, topProperties } from "@/content/tr/company";
import { trPalettes } from "@/content/tr/palettes";

/**
 * Первый экран: обложка меморандума.
 *
 * Слева — заявление, справа — терм-шит: три их собственных объекта с
 * ценой и доходностью, набранные как печатная таблица. Это и есть тезис
 * страницы: сюда приходят не смотреть виды, а считать.
 *
 * Глубина в четыре слоя: дальше всех выцветший кадр Дубая, за ним
 * засечное слово водяным пятном, ближе текст, и совсем близко таблица.
 */
export function Hero() {
  const stage = useStage<HTMLElement>();

  return (
    <section
      ref={stage}
      id="hero"
      className="relative isolate overflow-hidden px-5 pb-20 pt-16 sm:px-8 lg:pb-24 lg:pt-20"
    >
      <div
        aria-hidden
        className="w-layer pointer-events-none absolute inset-x-0 -top-[12%] -z-20 h-[120%] opacity-[0.13]"
        style={{ "--w-depth": "230px", "--w-pull": "14px" } as React.CSSProperties}
      >
        <Image
          src="/images/tr/cities/uae-dubai.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          className="scale-110 object-cover [mask-image:linear-gradient(to_bottom,transparent,black_24%,black_56%,transparent_88%)]"
        />
      </div>

      <div
        aria-hidden
        className="w-layer pointer-events-none absolute -left-[3%] top-[22%] -z-10 hidden select-none font-[family-name:var(--w-display)] text-[19vw] font-semibold leading-none tracking-[-0.04em] text-[var(--w-accent)] opacity-[0.05] lg:block"
        style={{ "--w-depth": "170px", "--w-pull": "24px" } as React.CSSProperties}
      >
        Tranio
      </div>

      <div className="mx-auto grid w-full max-w-[1500px] items-start gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <div
          className="w-layer"
          style={{ "--w-depth": "-88px", "--w-pull": "-18px" } as React.CSSProperties}
        >
          <p className="tr-eyebrow">Инвестиционный меморандум · {company.tagline}</p>

          <h1 className="mt-6 font-[family-name:var(--w-display)] text-[clamp(2.4rem,5.6vw,4.3rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-[var(--w-ink)]">
            Недвижимость за рубежом,
            <br />
            посчитанная <span className="text-[var(--w-accent)]">до покупки</span>
          </h1>

          <p className="mt-7 max-w-xl text-[1.04rem] leading-relaxed text-[var(--w-muted)]">
            {company.lead}
          </p>

          <Counters />

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#search"
              className="rounded-[var(--w-radius)] bg-[var(--w-accent)] px-7 py-3.5 text-sm font-medium text-[var(--w-accent-ink)] transition-opacity hover:opacity-90"
            >
              Подобрать направление
            </a>
            <a
              href="#strategies"
              className="rounded-[var(--w-radius)] border border-[var(--w-line)] px-7 py-3.5 text-sm transition-colors hover:border-[var(--w-accent)]"
            >
              Посчитать доходность
            </a>
          </div>

          <PaletteSwitch world="tr" palettes={trPalettes} className="mt-9" />
        </div>

        {/* Терм-шит */}
        <div
          className="w-layer"
          style={{ "--w-depth": "-180px", "--w-pull": "30px" } as React.CSSProperties}
        >
          <div className="overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] shadow-[var(--w-shadow)]">
            <div className="flex items-baseline justify-between gap-4 border-b border-[var(--w-line)] px-6 py-4">
              <p className="tr-eyebrow">Топ-3 сентября</p>
              <p className="tr-figure text-[0.76rem] text-[var(--w-muted)]">доходность, годовых</p>
            </div>
            <ul>
              {topProperties.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 border-b border-[var(--w-line)] px-6 py-4 last:border-0"
                >
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-[var(--w-radius)]">
                    <Image
                      src={`/images/tr/top/${item.photo}.webp`}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.94rem] text-[var(--w-ink)]">
                      {item.title}
                    </span>
                    <span className="tr-figure mt-1 block text-[0.8rem] text-[var(--w-muted)]">
                      {item.price}
                    </span>
                  </span>
                  <span className="tr-figure tr-yield shrink-0 text-[1.2rem]">
                    {item.yield.toLocaleString("ru-RU", { minimumFractionDigits: 1 })}%
                  </span>
                </li>
              ))}
            </ul>
            <p className="border-t border-[var(--w-line)] bg-[var(--w-paper)] px-6 py-3.5 text-[0.76rem] leading-relaxed text-[var(--w-muted)]">
              Объекты и цифры — с их главной, без правок.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Counters() {
  return (
    <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-7 border-t border-[var(--w-line)] pt-8 sm:grid-cols-4">
      {stats.map((item, index) => (
        <div key={item.label}>
          {/* «более» стоит отдельной строкой, а не перед числом: пока
              счётчик бежит, ширина числа меняется, и приставка на той же
              строке утаскивала бы цифру на вторую. */}
          <dt className="min-h-[2.6em]">
            {item.prefix ? (
              <span className="block text-[0.72rem] leading-none text-[var(--w-muted)]">
                {item.prefix}
              </span>
            ) : (
              <span className="block h-[0.72rem]" aria-hidden />
            )}
            <span className="tr-figure mt-1.5 block whitespace-nowrap text-[clamp(1.4rem,2.8vw,2rem)] leading-none text-[var(--w-ink)]">
              <Count to={item.value} delay={index * 120} />
            </span>
          </dt>
          <dd className="mt-2.5 text-[0.78rem] leading-snug text-[var(--w-muted)]">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Счётчик, который видно.
 *
 * Тот же приём, что на Namuna: цифра ждёт конца загрузки, иначе успевает
 * досчитаться, пока страница ещё рисуется, и человек её не видит. Ни
 * значение, ни видимость не хранятся в состоянии React — счётчик сам
 * наблюдает за своим узлом и пишет в него текст.
 */
function Count({ to, delay = 0 }: { to: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = to.toLocaleString("ru-RU").replace(/\s/g, " ");
      return;
    }

    let frame = 0;
    let running = false;
    const run = () => {
      if (running) return;
      running = true;
      let start = 0;
      const draw = (now: number) => {
        if (!start) start = now + delay;
        const p = Math.min(Math.max((now - start) / 2100, 0), 1);
        const value = Math.round(to * (1 - (1 - p) ** 4));
        node.textContent = value.toLocaleString("ru-RU").replace(/\s/g, " ");
        if (p < 1) {
          frame = requestAnimationFrame(draw);
          return;
        }
        running = false;
      };
      node.textContent = "0";
      frame = requestAnimationFrame(draw);
    };

    let observer: IntersectionObserver | undefined;
    const watch = () => {
      if (typeof IntersectionObserver === "undefined") {
        run();
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) if (entry.isIntersecting) run();
        },
        { threshold: 0.6, rootMargin: "0px 0px -10% 0px" },
      );
      observer.observe(node);
    };

    let settle = 0;
    const onLoad = () => {
      settle = window.setTimeout(watch, 460);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(settle);
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [to, delay]);

  return <span ref={ref}>0</span>;
}
