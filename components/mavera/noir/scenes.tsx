"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Addon, useAddon } from "@/components/configurator/context";
import { Magnetic, Words } from "@/components/mavera/configurator/live";
import { ParallaxFigure } from "@/components/mavera/lux/parallax-figure";
import { Rise } from "@/components/mavera/reveal";
import { money } from "@/components/present/mavera/theme";
import type { Project } from "@/content/mavera/data";
import { amenities, manifesto, noirCover, noirPhotos } from "@/content/mavera/noir";
import { cn } from "@/lib/cn";

/**
 * Сцены «Премиум Noir» — люкс-сегмент по американской модели.
 *
 * Глубина здесь двойная. Прокрутка двигает слои с разной скоростью — это
 * работает и на телефоне, где мыши нет. На компьютере к ней добавляется
 * указатель: кадр и заголовок чуть уходят от курсора в разные стороны, и
 * экран отвечает на движение руки, как витрина на Пятой авеню на шаг
 * прохожего. Оба сдвига пишутся в переменные узла без перерисовки React.
 */
function useDepth(depth: number) {
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
    // Только мышь: палец на экране двигает страницу, а не кадр.
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = node.getBoundingClientRect();
      node.style.setProperty("--mx", ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
      node.style.setProperty("--my", ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
    };
    const onLeave = () => {
      node.style.setProperty("--mx", "0");
      node.style.setProperty("--my", "0");
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    node.addEventListener("pointermove", onPointer);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      node.removeEventListener("pointermove", onPointer);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [depth]);

  return ref;
}

/* ------------------------------------------------------------------ */
/* Первый экран: ночной кадр во весь экран, три слоя глубины           */
/* ------------------------------------------------------------------ */

export function NoirHero({
  hero,
}: {
  hero: { eyebrow: string; titleTop: string; titleBottom: string; lead: string; primary: string; secondary: string };
}) {
  const ref = useDepth(180);
  const live = useAddon("hero");

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* Слой 1 — кадр: уезжает медленнее страницы и уходит от курсора. */}
      <div
        className="w-parallax absolute inset-[-6%] -z-30 transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform:
            "translate3d(calc(var(--mx, 0) * -22px), calc(var(--shift, 0px) + var(--my, 0) * -14px), 0) scale(1.06)",
        }}
      >
        <Image
          src={noirPhotos.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className={cn("object-cover", live && "w-kenburns")}
        />
      </div>

      {/* Слой 2 — тьма: кадр уходит в фон снизу и по краям, заголовок ложится на плотный чёрный. */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-t from-[var(--w-bg)] via-[var(--w-bg)]/55 to-[var(--w-bg)]/10" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-r from-[var(--w-bg)]/70 via-transparent to-transparent" />

      {/* Слой 3 — свет: латунное пятно дышит и идёт за курсором навстречу кадру. */}
      <div
        aria-hidden="true"
        className="w-blob absolute -left-40 bottom-10 -z-10 h-[34rem] w-[34rem] rounded-full blur-[130px] transition-transform duration-700 ease-out"
        style={{
          background: "radial-gradient(circle, var(--w-accent-soft), transparent 68%)",
          transform: "translate3d(calc(var(--mx, 0) * 40px), calc(var(--my, 0) * 30px), 0)",
        }}
      />

      <div className="mx-auto w-full max-w-[1500px] px-5 pb-16 sm:px-8 lg:pb-24">
        <div
          className="w-parallax grid gap-10 lg:grid-cols-12 lg:items-end"
          style={{
            transform: "translate3d(calc(var(--mx, 0) * 10px), calc(var(--p, 0) * -90px), 0)",
            opacity: "calc(1 - var(--p, 0) * 1.15)",
          }}
        >
          <div className="lg:col-span-8">
            <Addon id="hero" flag>
              <p className="flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.36em] text-[var(--w-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-[var(--w-accent)]" />
                {hero.eyebrow}
              </p>
              <h1 className="mt-8 max-w-4xl text-[clamp(2.7rem,7.4vw,6.6rem)] leading-[0.98]">
                <Words text={hero.titleTop} />
                <br />
                <span className="italic text-[var(--w-accent)]">
                  <Words text={hero.titleBottom} offset={300} />
                </span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--w-muted)]">{hero.lead}</p>
            </Addon>

            <Addon id="magnetic" flag className="mt-10">
              <div className="flex flex-wrap items-center gap-4">
                <Magnetic>
                  <a
                    href="#contacts"
                    className="w-glow inline-block rounded-[var(--w-radius)] bg-[var(--w-accent)] px-8 py-4 text-sm font-medium text-[var(--w-accent-ink)]"
                  >
                    {hero.primary}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="#projects"
                    className="inline-block rounded-[var(--w-radius)] border border-[var(--w-ink)]/30 px-8 py-4 text-sm text-[var(--w-ink)] backdrop-blur-sm transition-colors hover:border-[var(--w-accent)]"
                  >
                    {hero.secondary}
                  </a>
                </Magnetic>
              </div>
            </Addon>
          </div>

          {/* Три факта справа — как табличка у входа: коротко, латунью, без восклицаний. */}
          <dl className="grid grid-cols-3 gap-4 border-t border-[var(--w-line)] pt-6 lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            {[
              ["6", "резиденций в Ташкенте"],
              ["14", "лет на рынке"],
              ["по записи", "частные показы"],
            ].map(([value, label]) => (
              <div key={label}>
                <dd className="text-2xl text-[var(--w-ink)] tabular-nums">{value}</dd>
                <dt className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--w-muted)]">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--w-accent)] to-transparent"
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Манифест: два предложения вместо слогана                            */
/* ------------------------------------------------------------------ */

export function Manifesto() {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <Rise className="lg:col-span-8">
          <p className="flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.36em] text-[var(--w-accent)]">
            <span aria-hidden="true" className="h-px w-10 bg-[var(--w-accent)]" />
            {manifesto.eyebrow}
          </p>
          <h2 className="mt-8 text-[clamp(1.9rem,4vw,3.4rem)] leading-[1.12]">
            {manifesto.lines[0]}
            <br />
            <span className="text-[var(--w-muted)]">{manifesto.lines[1]}</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--w-muted)]">{manifesto.text}</p>
        </Rise>

        <Rise delay={140} className="lg:col-span-4 lg:pt-4">
          <ParallaxFigure
            src={noirPhotos.living}
            alt=""
            depth={34}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] [&>div]:aspect-[4/3]"
          />
          <dl className="mt-8 divide-y divide-[var(--w-line)] border-y border-[var(--w-line)]">
            {manifesto.facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-6 py-5">
                <dd className="text-3xl text-[var(--w-accent)] tabular-nums">{fact.value}</dd>
                <dt className="text-right text-sm text-[var(--w-muted)]">{fact.label}</dt>
              </div>
            ))}
          </dl>
        </Rise>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Коллекция резиденций: ночные кадры, каждый едет со своей скоростью  */
/* ------------------------------------------------------------------ */

export function Collection({ claims, projects }: { claims: Record<string, string>; projects: Project[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => {
        const wide = index === 0;
        return (
          <Rise
            as="li"
            key={project.slug}
            delay={index * 70}
            className={cn(wide && "md:col-span-2")}
          >
            <Link
              href={`/mavera/noir/${project.slug}`}
              prefetch={false}
              className="group relative block overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] transition-colors duration-500 hover:border-[var(--w-accent)]/60"
            >
              <ParallaxFigure
                src={noirCover(project.slug, project.photo)}
                alt=""
                depth={wide ? 46 : 30}
                sizes={wide ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
                className={cn("relative", wide ? "aspect-[16/9] lg:aspect-[21/9]" : "aspect-[4/5] sm:aspect-[4/3]")}
                imageClassName="transition-transform duration-[1200ms] ease-[var(--w-ease)] group-hover:scale-[1.18]"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--w-bg)] via-[var(--w-bg)]/35 to-transparent" />

              <span className="absolute left-5 top-5 rounded-[var(--w-radius)] border border-[var(--w-ink)]/20 bg-[var(--w-bg)]/60 px-3 py-1 text-[0.66rem] uppercase tracking-[0.2em] text-[var(--w-ink)] backdrop-blur-sm">
                {project.status}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
                      {project.segment} · {project.district}
                    </p>
                    <h3 className={cn("mt-2 text-[var(--w-ink)]", wide ? "text-3xl sm:text-4xl" : "text-2xl")}>
                      Резиденция «{project.name}»
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--w-muted)]">{claims[project.slug]}</p>
                  </div>
                  <span className="hidden shrink-0 text-right sm:block">
                    <span className="block text-lg text-[var(--w-ink)] tabular-nums">от {money(project.priceUsd, "uzs")}</span>
                    <span className="block text-xs text-[var(--w-muted)]">за м²</span>
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--w-accent)]">
                  Смотреть резиденцию
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                </span>
              </div>
            </Link>
          </Rise>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Сервис резиденций: лобби, крыша, бассейн                            */
/* ------------------------------------------------------------------ */

export function Amenities() {
  const frames = [
    { src: noirPhotos.lobby, caption: "Лобби и консьерж", depth: 30 },
    { src: noirPhotos.entrance, caption: "Приватный подъезд и валет-паркинг", depth: 36 },
    { src: noirPhotos.rooftop, caption: "Лаунж на крыше", depth: 30 },
    { src: noirPhotos.pool, caption: "Бассейн и SPA для жильцов", depth: 30 },
  ];

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
      <Rise className="max-w-2xl">
        <p className="flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.36em] text-[var(--w-accent)]">
          <span aria-hidden="true" className="h-px w-10 bg-[var(--w-accent)]" />
          {amenities.eyebrow}
        </p>
        <h2 className="mt-8 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08]">{amenities.title}</h2>
        <p className="mt-5 text-lg leading-relaxed text-[var(--w-muted)]">{amenities.note}</p>
      </Rise>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {frames.map((frame, index) => (
          <Rise key={frame.caption} delay={index * 90}>
            <ParallaxFigure
              src={frame.src}
              alt=""
              depth={frame.depth}
              caption={frame.caption}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] [&>div]:aspect-[4/5] [&>figcaption]:px-1 [&>figcaption]:not-italic"
            />
          </Rise>
        ))}
      </div>

      <ol className="mt-14 grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] md:grid-cols-2 lg:grid-cols-3">
        {amenities.items.map((item, index) => (
          <Rise as="li" key={item.title} delay={index * 60} className="bg-[var(--w-surface)] p-7">
            <span className="text-sm text-[var(--w-accent)] tabular-nums">0{index + 1}</span>
            <h3 className="mt-4 text-xl">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--w-muted)]">{item.text}</p>
          </Rise>
        ))}
      </ol>
    </div>
  );
}
