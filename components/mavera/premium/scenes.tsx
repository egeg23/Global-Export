"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Addon, useAddon } from "@/components/configurator/context";
import { Magnetic, Words } from "@/components/mavera/configurator/live";
import { money } from "@/components/present/mavera/theme";
import type { Project } from "@/content/mavera/data";
import { cn } from "@/lib/cn";

/** Прокрутка страницы, записанная в переменную узла: 0 — верх кадра, 1 — ушёл. */
function useScrollShift(depth: number) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = () => {
      frame.current = 0;
      const box = node.getBoundingClientRect();
      const progress = Math.min(Math.max(-box.top / Math.max(box.height, 1), 0), 1);
      node.style.setProperty("--p", progress.toFixed(4));
      node.style.setProperty("--shift", `${(progress * depth).toFixed(1)}px`);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [depth]);

  return ref;
}

/**
 * Сцена первого экрана: три слоя на разной глубине.
 *
 * Снимок уезжает медленнее страницы, засветка стоит на месте, заголовок
 * обгоняет оба и растворяется — глубина берётся не из тени, а из разной
 * скорости. Световые пятна дышат сами по себе, независимо от прокрутки;
 * цвет они берут из палитры, поэтому переключение света их не минует.
 */
export function CinemaHero({
  hero,
}: {
  hero: { eyebrow: string; titleTop: string; titleBottom: string; lead: string; primary: string; secondary: string };
}) {
  const ref = useScrollShift(160);
  // «Живой первый экран»: кадр наезжает поверх параллакса, слова всплывают по очереди.
  const live = useAddon("hero");

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden"
    >
      <div
        className="w-parallax absolute inset-0 -z-30 scale-110"
        style={{ transform: "translate3d(0, var(--shift, 0px), 0) scale(1.1)" }}
      >
        <Image
          src="/images/mavera/hero-cinema.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={cn("object-cover", live && "w-kenburns")}
        />
      </div>

      {/* Засветка вместо затемнения: снимок уходит в бумагу, а заголовок
          внизу ложится на плотный край и читается без подложки. */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-t from-[var(--w-bg)] via-[var(--w-bg)]/72 to-[var(--w-bg)]/28" />

      {/* Световые пятна — подпись «кинозала». */}
      <div
        aria-hidden="true"
        className="w-blob absolute -left-32 top-1/4 -z-10 h-[32rem] w-[32rem] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--w-accent-soft), transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="w-blob absolute -right-40 bottom-0 -z-10 h-[26rem] w-[26rem] rounded-full blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--w-accent-soft), transparent 70%)", animationDelay: "-8s" }}
      />

      <div className="mx-auto w-full max-w-[1500px] px-5 pb-20 sm:px-8 lg:pb-28">
        <div
          className="w-parallax"
          style={{
            transform: "translate3d(0, calc(var(--p, 0) * -90px), 0)",
            opacity: "calc(1 - var(--p, 0) * 1.1)",
          }}
        >
          <Addon id="hero" flag>
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">
              {hero.eyebrow}
            </p>
            <h1 className="mt-7 max-w-4xl text-[clamp(2.6rem,7vw,6rem)] leading-[0.98]">
              <Words text={hero.titleTop} />
              <br />
              <Words text={hero.titleBottom} offset={300} />
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--w-muted)]">{hero.lead}</p>
          </Addon>

          <Addon id="magnetic" flag className="mt-10">
            <div className="flex flex-wrap items-center gap-4">
              <Magnetic>
                <a href="#picker" className="w-glow inline-block rounded-full bg-[var(--w-accent)] px-8 py-4 text-sm font-medium text-[var(--w-accent-ink)]">
                  {hero.primary}
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#genplan" className="inline-block rounded-full border border-[var(--w-line)] px-8 py-4 text-sm text-[var(--w-ink)] backdrop-blur-sm">
                  {hero.secondary}
                </a>
              </Magnetic>
            </div>
          </Addon>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--w-muted)] to-transparent"
      />
    </section>
  );
}

/** Цифра, которая досчитывается, когда доезжает до экрана. */
function Counter({ value, suffix }: { value: string; suffix?: string }) {
  const target = Number(value.replace(/[^\d,]/g, "").replace(",", "."));
  const [shown, setShown] = useState(value);
  const started = useRef(false);
  // Счёт — часть допника «Анимации»: без него цифра просто стоит.
  const animate = useAddon("motion");

  const attach = useCallback(
    (node: HTMLSpanElement | null) => {
      if (!node || started.current || !Number.isFinite(target) || target === 0) return;
      if (typeof IntersectionObserver === "undefined") return;

      const decimals = value.includes(",") ? 1 : 0;
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const from = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - from) / 1500, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(
            p === 1
              ? value
              : (target * eased)
                  .toFixed(decimals)
                  .replace(".", ",")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
          );
          if (p < 1) requestAnimationFrame(tick);
        };
        setShown("0");
        requestAnimationFrame(tick);
      });

      observer.observe(node);
      return () => observer.disconnect();
    },
    [target, value, animate],
  );

  return (
    <span ref={attach} className="tabular-nums">
      {shown}
      {suffix ? <span className="ml-2 text-base font-normal text-[var(--w-accent)]">{suffix}</span> : null}
    </span>
  );
}

export function Counters({ items }: { items: { value: string; suffix?: string; label: string }[] }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-[var(--w-surface)] p-8">
          <dd className="text-[clamp(2.2rem,4vw,3.4rem)] font-semibold leading-none">
            <Counter value={item.value} suffix={item.suffix} />
          </dd>
          <dt className="mt-4 text-sm text-[var(--w-muted)]">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/**
 * Кинолента проектов: карточки едут горизонтально, снимок внутри каждой —
 * с собственной скоростью, поэтому лента читается как проезд камеры.
 */
export function FilmRail({ claims, projects }: { claims: Record<string, string>; projects: Project[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="w-rail flex gap-5 overflow-x-auto pb-6">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/mavera/premium/${project.slug}`}
            prefetch={false}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            className={cn(
              "group relative w-[min(84vw,30rem)] shrink-0 overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] transition-all duration-500 ease-[var(--w-ease)]",
              active === index ? "w-glow" : "opacity-70",
            )}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={project.photo}
                alt=""
                fill
                sizes="(min-width: 640px) 30rem, 84vw"
                className="object-cover transition-transform duration-[900ms] ease-[var(--w-ease)] group-hover:scale-105 motion-reduce:transform-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--w-surface)] via-transparent to-transparent" />
              <span className="absolute left-5 top-5 rounded-full border border-[var(--w-line)] bg-[var(--w-surface)]/75 px-3 py-1 text-[0.7rem] uppercase tracking-[0.14em] backdrop-blur-sm">
                {project.status}
              </span>
            </div>

            <div className="p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl">ЖК «{project.name}»</h3>
                <span className="text-sm text-[var(--w-muted)]">{project.segment}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--w-muted)]">{claims[project.slug]}</p>
              <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-[var(--w-line)] pt-4">
                <span className="whitespace-nowrap text-lg font-medium tabular-nums">
                  от {money(project.priceUsd, "uzs")}
                  <span className="ml-1 text-sm font-normal text-[var(--w-muted)]">за м²</span>
                </span>
                <span className="whitespace-nowrap text-sm text-[var(--w-accent)]">Выбрать квартиру →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-2 flex gap-1.5">
        {projects.map((project, index) => (
          <span
            key={project.slug}
            className={cn(
              "h-0.5 flex-1 rounded-full transition-colors duration-500",
              active === index ? "bg-[var(--w-accent)]" : "bg-[var(--w-line)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
