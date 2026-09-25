"use client";

import { useEffect, useRef } from "react";

import { PaletteSwitch } from "@/components/showcase/palette";
import { useStage } from "@/components/showcase/depth";
import { useLang, useT } from "@/components/tt/lang";
import { company, stats } from "@/content/tt/company";
import { KZ_H, KZ_W, links } from "@/content/tt/kzmap";
import { ttPalettesFor } from "@/content/tt/palettes";

/**
 * Первый экран: пульт.
 *
 * Тезис страницы — не «широкий спектр телекоммуникационных услуг», а
 * пятнадцать тысяч километров волокна под ногами. Поэтому за текстом
 * идёт та же схема магистрали, что и в третьей главе, только выцветшая
 * и без подписей: она даёт фон, который ни у кого больше в отрасли не
 * получится повторить, — у остальных его просто нет.
 */
export function Hero() {
  const t = useT();
  const { lang } = useLang();
  const stage = useStage<HTMLElement>();

  return (
    <section
      ref={stage}
      id="hero"
      className="tt-grid relative isolate overflow-hidden px-5 pb-20 pt-16 sm:px-8 lg:pb-24 lg:pt-20"
    >
      {/* Магистраль фоном: самый дальний слой. */}
      <div
        aria-hidden
        className="w-layer pointer-events-none absolute inset-0 -z-20 opacity-[0.22]"
        style={{ "--w-depth": "180px", "--w-pull": "18px" } as React.CSSProperties}
      >
        <svg
          viewBox={`-40 -30 ${KZ_W + 80} ${KZ_H + 60}`}
          className="h-full w-full [mask-image:radial-gradient(ellipse_at_65%_45%,black,transparent_72%)]"
          preserveAspectRatio="xMidYMid slice"
        >
          {links.map((link) => (
            <path
              key={link.id}
              d={`M${link.a.x.toFixed(1)} ${link.a.y.toFixed(1)}L${link.b.x.toFixed(1)} ${link.b.y.toFixed(1)}`}
              className="tt-fibre"
              data-live=""
            />
          ))}
        </svg>
      </div>

      <div className="mx-auto grid w-full max-w-[1500px] items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div
          className="w-layer"
          style={{ "--w-depth": "-86px", "--w-pull": "-16px" } as React.CSSProperties}
        >
          <p className="tt-signal">{t(company.tagline)}</p>

          <h1 className="mt-6 font-[family-name:var(--w-display)] text-[clamp(2.3rem,5.4vw,4.1rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-[var(--w-ink)]">
            {t({
              ru: "Пятнадцать тысяч километров",
              kk: "Он бес мың километр",
            })}
            <br />
            <span className="text-[var(--w-accent)]">
              {t({ ru: "под вашим бизнесом", kk: "сіздің бизнесіңіздің астында" })}
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-[1.04rem] leading-relaxed text-[var(--w-muted)]">
            {t(company.lead)}
          </p>

          <Counters />

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#builder"
              className="rounded-[var(--w-radius)] bg-[var(--w-accent)] px-7 py-3.5 text-sm font-medium text-[var(--w-accent-ink)] transition-opacity hover:opacity-90"
            >
              {t({ ru: "Собрать подключение", kk: "Қосылымды жинау" })}
            </a>
            <a
              href={`tel:${company.phone}`}
              className="tt-figure rounded-[var(--w-radius)] border border-[var(--w-line)] px-7 py-3.5 text-sm transition-colors hover:border-[var(--w-accent)]"
            >
              {company.phone}
            </a>
          </div>

          <PaletteSwitch world="tt" palettes={ttPalettesFor(lang)} className="mt-9" />
        </div>

        {/* Миссия и история — то, что у них на главной первым абзацем. */}
        <div
          className="w-layer"
          style={{ "--w-depth": "-170px", "--w-pull": "28px" } as React.CSSProperties}
        >
          <div className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)] sm:p-8">
            <p className="tt-signal">{t({ ru: "Миссия", kk: "Миссия" })}</p>
            <p className="mt-4 font-[family-name:var(--w-display)] text-[1.45rem] font-bold leading-snug text-[var(--w-accent)]">
              {t(company.mission)}
            </p>
            <p className="mt-6 border-t border-[var(--w-line)] pt-5 text-[0.9rem] leading-relaxed text-[var(--w-muted)]">
              {t(company.history)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Counters() {
  const t = useT();

  return (
    <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-7 border-t border-[var(--w-line)] pt-8 sm:grid-cols-4">
      {stats.map((item, index) => (
        <div key={item.label.ru}>
          <dt className="tt-figure whitespace-nowrap text-[clamp(1.4rem,2.8vw,2rem)] leading-none text-[var(--w-ink)]">
            {item.plain ? (
              <span>{item.plain}</span>
            ) : (
              <Count to={item.value!} delay={index * 120} />
            )}
            {item.unit ? (
              <span className="ml-1 text-[0.5em] text-[var(--w-accent)]">{t(item.unit)}</span>
            ) : null}
          </dt>
          <dd className="mt-2.5 text-[0.78rem] leading-snug text-[var(--w-muted)]">
            {t(item.label)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Счётчик, который видно.
 *
 * Тот же приём, что на остальных витринах: цифра ждёт конца загрузки,
 * иначе успевает досчитаться, пока страница рисуется.
 */
function Count({ to, delay = 0 }: { to: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const show = (value: number) => value.toLocaleString("ru-RU").replace(/\s/g, " ");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = show(to);
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
        const p = Math.min(Math.max((now - start) / 2000, 0), 1);
        node.textContent = show(Math.round(to * (1 - (1 - p) ** 4)));
        if (p < 1) {
          frame = requestAnimationFrame(draw);
          return;
        }
        running = false;
      };
      node.textContent = show(0);
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
