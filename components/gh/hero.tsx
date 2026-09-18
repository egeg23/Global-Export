"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { useStage } from "@/components/gh/depth";
import { replayIntro, useIntroDone } from "@/components/gh/intro";
import { company, contacts, stats } from "@/content/gh/company";
import { photo } from "@/content/gh/photos";
import { cn } from "@/lib/cn";

/**
 * Первый экран: дом слева, слово справа.
 *
 * Он не начинается сам — он продолжает заставку. Пока камера идёт от планеты
 * к кварталу, экран стоит собранным под ней; в последнюю секунду заставка
 * растворяется, и дом выезжает слева, а текст проявляется справа. Отсюда
 * общее состояние `useIntroDone`: два независимых куска должны сойтись в
 * один кадр.
 *
 * Глубина здесь в четыре слоя, и она настоящая, а не «фон чуть медленнее».
 * Дальше всех — квартал с высоты, почти растворённый в бумаге; за ним знак
 * водяным пятном и тёплое свечение; ближе всех дом, который обгоняет
 * прокрутку. Текст идёт своим темпом между ними. На компьютере к прокрутке
 * добавляется курсор: дом уходит от него в одну сторону, текст в другую.
 *
 * Считает это одна подписка на весь раздел (`useStage`), а слои только
 * умножают её доли на свою глубину. Вход (`gh-enter`) и глубина (`gh-layer`)
 * живут на разных узлах: оба правят `transform`, и на одном узле побеждал бы
 * кто-то один — именно из-за этого дом сначала не двигался вовсе.
 */
export function Hero() {
  const done = useIntroDone();
  const stage = useStage<HTMLElement>();

  return (
    <section
      ref={stage}
      id="hero"
      className="relative isolate min-h-[100svh] overflow-hidden pt-24 lg:pt-20"
    >
      {/* Самый дальний слой: их квартал с высоты, почти выцветший. Он не
          читается как фотография — он даёт первому экрану дно, от которого
          отсчитывается всё остальное. */}
      <div
        aria-hidden
        className="gh-layer pointer-events-none absolute inset-x-0 -top-[12%] -z-20 h-[112%] opacity-[0.09]"
        style={
          { "--gh-depth": "150px", "--gh-pull": "8px" } as React.CSSProperties
        }
      >
        {/* Маска гасит слой и сверху тоже: под липкой шапкой город
            проступал грязной полосой. */}
        <Image
          src={photo("aerial")}
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_46%,transparent_82%)]"
        />
      </div>

      {/* Знак водяным пятном — второй по дальности. */}
      <div
        aria-hidden
        className="gh-layer pointer-events-none absolute -right-[6%] top-[14%] -z-10 hidden w-[42vw] max-w-[640px] opacity-[0.05] lg:block"
        style={
          { "--gh-depth": "110px", "--gh-pull": "12px" } as React.CSSProperties
        }
      >
        <Image
          src="/images/gh/logo.svg"
          alt=""
          width={469}
          height={57}
          className="h-auto w-full"
        />
      </div>

      {/* Тёплое свечение за домом: у слоновой кости нет собственной глубины,
          и без подсветки дом лежит на листе, а не стоит в воздухе. */}
      <div
        aria-hidden
        className="gh-layer pointer-events-none absolute inset-0 -z-10"
        style={
          { "--gh-depth": "64px", "--gh-pull": "18px" } as React.CSSProperties
        }
      >
        <div className="absolute -left-[10%] bottom-0 h-[86%] w-[78%] rounded-full bg-[radial-gradient(closest-side,var(--w-accent-soft),transparent)] blur-2xl" />
      </div>

      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 items-end gap-0 px-0 lg:grid-cols-[1.02fr_1fr]">
        {/* Дом. Вход снаружи, глубина внутри: на одном узле они спорят за
            transform, и побеждает вход — дом замирает. */}
        <div
          className={cn(
            "order-1 h-[46svh] w-full self-end lg:h-[86svh]",
            "gh-enter",
            done && "gh-enter-in",
          )}
          style={
            {
              "--gh-from-x": "-46px",
              "--gh-from-y": "0px",
            } as React.CSSProperties
          }
        >
          <div
            className="gh-layer relative h-full w-full"
            style={
              {
                "--gh-depth": "-170px",
                "--gh-pull": "30px",
              } as React.CSSProperties
            }
          >
            <Image
              src="/images/gh/house.webp"
              alt="Жилой комплекс O`Z MAKON, вид с бульвара"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>

        {/* Слово */}
        <div
          className={cn("order-2", "gh-enter", done && "gh-enter-in")}
          style={{ "--gh-delay": "260ms" } as React.CSSProperties}
        >
          <div
            className="gh-layer px-5 pb-16 pt-10 sm:px-8 lg:pb-[12svh] lg:pl-10 lg:pr-12"
            style={
              {
                "--gh-depth": "-58px",
                "--gh-pull": "-16px",
              } as React.CSSProperties
            }
          >
            <p className="text-[0.68rem] uppercase tracking-[0.42em] text-[var(--w-accent)]">
              Golden House · Ташкент
            </p>
            <h1 className="mt-6 text-[clamp(2.4rem,6.2vw,4.6rem)] leading-[0.98]">
              <span className="gh-gold-text">{company.slogan}</span>
            </h1>
            <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-[var(--w-muted)]">
              {company.lead}
            </p>

            <Counters />

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#picker"
                className="w-glow rounded-full bg-[var(--w-accent)] px-6 py-3 text-sm font-medium text-[var(--w-accent-ink)] transition-opacity hover:opacity-90"
              >
                Подобрать квартиру
              </a>
              <a
                href={contacts.phoneHref}
                className="rounded-full border border-[var(--w-line)] px-6 py-3 text-sm transition-colors hover:border-[var(--w-accent)]"
              >
                {contacts.phone}
              </a>
              <button
                type="button"
                onClick={replayIntro}
                className="rounded-full px-4 py-3 text-sm text-[var(--w-muted)] underline decoration-[var(--gh-gold)] decoration-1 underline-offset-4 transition-colors hover:text-[var(--w-ink)]"
              >
                Смотреть заставку
              </button>
            </div>
          </div>
        </div>
      </div>

      <ScrollHint />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Цифры со страницы «О компании»: досчитываются, когда доходит очередь */
/* ------------------------------------------------------------------ */

function Counters() {
  const done = useIntroDone();

  return (
    <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
      {stats.map((item, index) => (
        <div key={item.label}>
          <dt className="text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-none text-[var(--w-ink)]">
            <Count to={item.value} run={done} delay={index * 140} />
            <span className="text-[var(--w-accent)]">{item.suffix}</span>
          </dt>
          <dd className="mt-2 text-[0.78rem] leading-snug text-[var(--w-muted)]">
            {item.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Число, которое досчитывается до своего значения за полторы секунды. */
function Count({
  to,
  run,
  delay = 0,
}: {
  to: number;
  run: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!run) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = String(to);
      return;
    }

    let frame = 0;
    let start = 0;
    const span = 1500;

    const draw = (now: number) => {
      if (!start) start = now + delay;
      const progress = Math.min(Math.max((now - start) / span, 0), 1);
      // Замедление к концу: счётчик должен приходить к числу, а не врезаться.
      const eased = 1 - (1 - progress) ** 3;
      node.textContent = String(Math.round(to * eased));
      if (progress < 1) frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [to, run, delay]);

  return <span ref={ref}>0</span>;
}

/* ------------------------------------------------------------------ */

function ScrollHint() {
  const done = useIntroDone();

  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex",
        "gh-enter",
        done && "gh-enter-in",
      )}
      style={{ "--gh-delay": "900ms" } as React.CSSProperties}
    >
      <span className="text-[0.62rem] uppercase tracking-[0.3em] text-[var(--w-muted)]">
        Листайте
      </span>
      <span className="h-10 w-px bg-gradient-to-b from-[var(--gh-gold)] to-transparent" />
    </div>
  );
}
