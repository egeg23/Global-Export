import { Playground } from "@/components/delta/playground";
import { school } from "@/content/delta/school";

/**
 * Первый экран: одна мысль для родителя и песочница рядом.
 *
 * Мысль взята из их же поста к родителям (#26) — «переключить внимание с
 * телефонных игр на полезную деятельность», — но сказана без упрёка: не
 * «ваш ребёнок зависим», как у конкурентов, а «пусть экран работает на него».
 */
export function DeltaHero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-dl-blue text-white">
      <Backdrop />

      <div className="relative mx-auto grid w-full max-w-[1240px] gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12 lg:pb-24 lg:pt-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em]">
            <span className="h-2 w-2 rounded-full bg-dl-lemon" aria-hidden="true" />
            IT-школа для детей {school.ages.from}–{school.ages.to} лет
          </p>

          <h1 className="mt-5 font-dl-display text-[2.35rem] font-black leading-[1.05] tracking-tight sm:text-5xl xl:text-[3.5rem]">
            Он всё равно за экраном.{" "}
            <span className="relative whitespace-nowrap text-dl-lemon">
              Пусть делает игры,
              <Squiggle />
            </span>{" "}
            а не только играет.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            Программирование, логика и IT-английский — {school.schedule.toLowerCase()}, {school.language}.
            Не верьте на слово: соберите первую программу прямо здесь. Это займёт полминуты.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#zapis" className="dl-press dl-focus rounded-full bg-dl-yellow px-6 py-3.5 text-base font-extrabold text-dl-ink">
              Записаться на пробный урок
            </a>
            <a
              href="#podbor"
              className="dl-focus rounded-full border-[3px] border-white/70 px-6 py-3 text-base font-extrabold text-white transition-colors hover:bg-white/10"
            >
              Подобрать ступень
            </a>
          </div>

          <ul className="mt-9 grid max-w-xl grid-cols-2 gap-3 text-sm font-bold sm:grid-cols-4">
            {[
              [`${school.ages.from}–${school.ages.to}`, "лет"],
              ["3 раза", "в неделю"],
              ["Класс", "и онлайн"],
              ["Deltcoin", "за старания"],
            ].map(([big, small]) => (
              <li key={big} className="rounded-2xl border-2 border-white/25 bg-white/10 px-3 py-2.5">
                <span className="block font-dl-display text-lg font-black leading-tight text-white">{big}</span>
                <span className="text-white/70">{small}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold text-white/80">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-dl-lemon text-xs font-black text-dl-ink" aria-hidden="true">
              ↓
            </span>
            Попробуйте сами — или дайте ребёнку
          </p>
          <div className="text-dl-ink">
            <Playground />
          </div>
        </div>
      </div>

      {/* Волна в цвет следующего раздела — страница не обрывается ступенькой. */}
      <svg className="relative block h-10 w-full text-dl-paper" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40 V18 Q180 0 360 16 T720 18 T1080 14 T1440 20 V40 Z" fill="currentColor" />
      </svg>
    </section>
  );
}

/** Подчёркивание от руки под «игры» — как маркером в тетради. */
function Squiggle() {
  return (
    <svg className="absolute -bottom-2 left-0 h-3 w-full text-dl-lemon/80" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 8 Q25 2 50 7 T100 7 T150 6 T198 5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Фон: тетрадная клетка и плавающие квадраты глобуса из знака. Большой
 * контур дельты справа — сам знак, разобранный на линию.
 */
function Backdrop() {
  const squares = [
    { c: "#FCE93A", x: "1.5%", y: "9%", s: 26, r: "-12deg", d: "0s" },
    { c: "#04BD62", x: "44%", y: "10%", s: 18, r: "10deg", d: "1.2s" },
    { c: "#E5322D", x: "3%", y: "78%", s: 20, r: "18deg", d: "2.1s" },
    { c: "#5BA8FF", x: "48%", y: "86%", s: 30, r: "-6deg", d: "0.6s" },
    { c: "#FCE93A", x: "92%", y: "8%", s: 16, r: "22deg", d: "1.7s" },
    { c: "#04BD62", x: "95%", y: "70%", s: 22, r: "-20deg", d: "2.6s" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute -right-24 -top-24 h-[34rem] w-[34rem] rounded-full bg-dl-sky/25 blur-3xl" />
      <svg className="absolute -right-10 top-10 h-[30rem] w-[30rem] text-white/[0.07]" viewBox="0 0 100 100">
        <path d="M50 6 L95 88 H5 Z" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
      </svg>
      {squares.map((sq) => (
        <span
          key={sq.x + sq.y}
          className="dl-float absolute hidden rounded-md border-[3px] border-dl-ink lg:block"
          style={
            {
              left: sq.x,
              top: sq.y,
              width: sq.s,
              height: sq.s,
              background: sq.c,
              animationDelay: sq.d,
              "--r": sq.r,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
