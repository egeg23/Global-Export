"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { useStage } from "@/components/showcase/depth";
import { company, contacts, stats } from "@/content/nm/company";
import { cn } from "@/lib/cn";
import { whenDevuzIntroDone } from "@/lib/brand/intro";

/**
 * Глава первая: кто это и что они делают.
 *
 * Разворот издательский — слово слева, кадр справа. Глубина в четыре слоя:
 * дальше всех выцветшая кухня во всю ширину, за ней засечный знак водяным
 * пятном, ближе кадр в раме, и совсем близко — текст. Слои идут в разные
 * стороны, поэтому лист перестаёт быть листом.
 *
 * Доли прокрутки и курсора считает одна подписка на раздел, слои только
 * умножают их на свою глубину (`--w-depth`, `--w-pull`).
 */
export function Hero() {
  const stage = useStage<HTMLElement>();

  return (
    <section
      ref={stage}
      id="hero"
      className="relative isolate overflow-hidden px-5 pb-20 pt-28 sm:px-8 lg:min-h-[100svh] lg:pb-24 lg:pt-32"
    >
      {/* Дальний слой: кухня во всю ширину, почти выцветшая. */}
      <div
        aria-hidden
        className="w-layer pointer-events-none absolute inset-x-0 -top-[10%] -z-20 h-[110%] opacity-[0.1]"
        style={{ "--w-depth": "230px", "--w-pull": "14px" } as React.CSSProperties}
      >
        <Image
          src="/images/nm/kitchen-island.webp"
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover [mask-image:linear-gradient(to_bottom,transparent,black_26%,black_54%,transparent_86%)]"
        />
      </div>

      {/* Засечный знак водяным пятном. */}
      <div
        aria-hidden
        className="w-layer pointer-events-none absolute -left-[4%] top-[18%] -z-10 hidden select-none font-[family-name:var(--w-display)] text-[22vw] leading-none text-[var(--nm-teal)] opacity-[0.045] lg:block"
        style={{ "--w-depth": "170px", "--w-pull": "26px" } as React.CSSProperties}
      >
        Namuna
      </div>

      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Слово */}
        <div
          className="w-layer"
          style={{ "--w-depth": "-92px", "--w-pull": "-20px" } as React.CSSProperties}
        >
          <p className="nm-chapter">01 — {company.tagline}</p>

          <h1 className="mt-7 text-[clamp(2.5rem,6vw,4.6rem)] leading-[1.02] text-[var(--nm-teal)]">
            Кухня, которую
            <br />
            <span className="nm-accent">делают</span> под вас
          </h1>

          <p className="mt-7 max-w-xl text-[1.04rem] leading-relaxed text-[var(--w-muted)]">
            {company.lead}
          </p>

          <Counters />

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#configurator"
              className="rounded-[var(--w-radius)] bg-[var(--nm-teal)] px-7 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Собрать кухню и узнать цену
            </a>
            <a
              href={contacts.branches[0].phoneHref}
              className="rounded-[var(--w-radius)] border border-[var(--w-line)] px-7 py-3.5 text-sm transition-colors hover:border-[var(--w-accent)]"
            >
              {contacts.branches[0].phone}
            </a>
          </div>

          <p className="mt-6 text-[0.8rem] text-[var(--w-muted)]">
            Основано {company.founded}. Производство на технологиях Германии и Австрии.
          </p>
        </div>

        {/* Кадр */}
        <div
          className="w-layer relative"
          style={{ "--w-depth": "-205px", "--w-pull": "38px" } as React.CSSProperties}
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--w-radius-lg)] bg-[var(--w-paper)] shadow-[var(--w-shadow)]">
            <Image
              src="/images/nm/kitchen-oak.webp"
              alt="Кухня со шпоном дуба наверху и матовыми фасадами внизу"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              style={{ "--w-depth": "86px", "--w-pull": "-16px" } as React.CSSProperties}
              className="w-layer scale-[1.14] object-cover"
            />
          </div>
          {/* Латунная рамка со смещением — приём с бумажных каталогов. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-[var(--w-radius-lg)] border border-[var(--nm-brass)] opacity-60"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Counters() {
  return (
    <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-8 gap-y-7 border-t border-[var(--w-line)] pt-8 sm:grid-cols-4">
      {stats.map((item, index) => (
        <div key={item.label}>
          <dt className="text-[clamp(1.5rem,3vw,2rem)] leading-none text-[var(--nm-teal)]">
            {item.prefix ? (
              <span className="mr-1 align-middle text-[0.6em] text-[var(--w-muted)]">
                {item.prefix}
              </span>
            ) : null}
            <Count to={item.value} delay={index * 130} />
            <span className="text-[var(--w-accent)]">{item.suffix}</span>
          </dt>
          <dd className="mt-2.5 text-[0.78rem] leading-snug text-[var(--w-muted)]">
            {item.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Число досчитывается до своего значения, когда доезжает до кадра.
 *
 * Две поправки против первой версии, где анимации фактически не было
 * видно. Первая: первый экран открыт сразу, поэтому счётчик успевал
 * отработать за те же полторы секунды, что страница грузилась, — теперь
 * он ждёт, пока браузер закончит загрузку, и только потом начинает.
 * Вторая: наблюдатель больше не отключается, и при возврате к первому
 * экрану цифры пересчитываются заново — это единственная анимация на
 * странице, которую человек захочет посмотреть второй раз.
 *
 * Ни счётчик, ни его видимость не хранятся в состоянии React: счётчик
 * сам наблюдает за своим узлом и пишет в него текст. Состояние здесь
 * дало бы шестьдесят перерисовок в секунду на каждую цифру.
 */
function Count({ to, delay = 0 }: { to: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      node.textContent = String(to);
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
        const progress = Math.min(Math.max((now - start) / 2200, 0), 1);
        node.textContent = String(Math.round(to * (1 - (1 - progress) ** 4)));
        node.style.setProperty("--nm-count", String(progress));
        if (progress < 1) {
          frame = requestAnimationFrame(draw);
          return;
        }
        running = false;
      };
      node.textContent = "0";
      frame = requestAnimationFrame(draw);
    };

    // Пока страница грузится, смотреть на цифры некому: ждём загрузки.
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
    let unhook = () => {};
    // Барабаны ждут заставку студии. Пустить их сразу — значит открутить
    // всё под её слоем: кадр откроется, а цифры уже стоят на месте, и
    // смотреть будет не на что.
    const onLoad = () => {
      unhook = whenDevuzIntroDone(() => {
        settle = window.setTimeout(watch, 500);
      });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      window.removeEventListener("load", onLoad);
      unhook();
      window.clearTimeout(settle);
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [to, delay]);

  return (
    <span ref={ref} className="nm-count">
      0
    </span>
  );
}

/** Полоса прочитанного — требование схемы «глав» из ui-ux-pro-max. */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const read = height > 0 ? window.scrollY / height : 0;
      node.style.setProperty("--nm-read", Math.min(Math.max(read, 0), 1).toFixed(4));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref} className={cn("nm-progress")} aria-hidden />;
}
