"use client";

import NumberFlow from "@number-flow/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Addon } from "@/components/configurator/context";
import { AdminPreview, Blog, Booking, Cabinet, CertCheck, Pay, Quiz } from "@/components/medacademy/shared/addons";
import { DtmCalculator } from "@/components/medacademy/shared/calculator";
import { IconB, type IconNameB } from "@/components/medacademy/shared/icons";
import { LangPills, LangProvider, useT } from "@/components/medacademy/shared/lang";
import { In, reducedMotion, useOnScreen } from "@/components/medacademy/shared/motion";
import { brand, contacts, courseFeatures, courses, mapHref, photos, reviews, sum, teachers, tgHref, type Course } from "@/content/medacademy/facts";
import { cn } from "@/lib/cn";

/**
 * Вариант B «Лаборатория» — живой и современный, как сильные онлайн-школы.
 *
 * Ультрафиолет, кислотный лайм, плотный дисплейный гротеск капслоком.
 * Первый экран — таблица элементов: Ch, Bi и Md складываются в формулу
 * поступления, за ними медленно дышат молекулы (canvas, пауза вне экрана).
 * Фирменный ход — экспресс-тест на пять вопросов с конфетти, а преподаватели
 * — карточки, которые переворачиваются и показывают баллы.
 */
export function SiteB() {
  return (
    <div data-ma="b" className="min-h-dvh">
      <LangProvider>
        <Header />
        <main>
          <Hero />
          <Ticker />
          <ExpressTest />
          <Block id="quiz" kicker="Подбор курса" title="Не знаешь, с чего начать? Четыре вопроса">
            <Addon id="quiz">
              <Quiz v="b" onDone={() => burst()} />
            </Addon>
          </Block>
          <Block id="score" kicker="Калькулятор DTM" title="Сколько баллов у тебя сейчас — и сколько было у них">
            <DtmCalculator v="b" />
          </Block>
          <Courses />
          <Block id="cabinet" kicker="Кабинет" title="Лекции, тесты и прогресс — в телефоне">
            <Addon id="cabinet">
              <Cabinet v="b" />
            </Addon>
          </Block>
          <Teachers />
          <Block id="cert" kicker="Сертификат" title="Проверка сертификата по номеру">
            <Addon id="cert">
              <CertCheck v="b" />
            </Addon>
          </Block>
          <Reviews />
          <Block id="booking" kicker="Запись" title="Выбери день — администратор подтвердит">
            <Addon id="booking">
              <Booking v="b" />
            </Addon>
          </Block>
          <Block id="blog" kicker="Блог" title="Разборы задач и новости приёма">
            <Addon id="blog">
              <Blog v="b" />
            </Addon>
          </Block>
          <Block id="admin" kicker="Для центра" title="Панель управления">
            <Addon id="admin">
              <AdminPreview v="b" />
            </Addon>
          </Block>
          <Contacts />
        </main>
        <Footer />
      </LangProvider>
    </div>
  );
}

/** Конфетти — грузится только в момент победы; при «уменьшить движение» не летит. */
function burst() {
  if (reducedMotion()) return;
  void import("canvas-confetti").then(({ default: confetti }) =>
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.7 },
      colors: ["#cff846", "#8d66ff", "#e995be", "#7dc2e3"],
      disableForReducedMotion: true,
    }),
  );
}

/* ------------------------------------------------------------------ */

function Header() {
  const t = useT();
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-3 rounded-[2rem] py-2 bg-ma-surface-2/95 pl-5 pr-2 shadow-[0_15px_35px_-18px_rgb(0_0_0/0.7)] ring-1 ring-white/10">
        <a href="#top" className="shrink-0" aria-label="MedAcademy — наверх">
          <Image src="/images/medacademy/logo-white.png" alt="MedAcademy" width={485} height={323} className="h-9 w-auto" priority />
        </a>
        <nav aria-label="Разделы" className="ml-4 hidden items-center gap-5 text-sm lg:flex">
          {[
            ["#courses", t("courses")],
            ["#teachers", t("teachers")],
            ["#score", t("score")],
            ["#contacts", t("contacts")],
          ].map(([href, label]) => (
            <a key={href} href={href} className="text-ma-ink-2 transition-colors hover:text-ma-accent">
              {label}
            </a>
          ))}
        </nav>
        <LangPills pill="ma-chip min-h-11" className="ml-auto" />
        <a
          href={tgHref("Привет! Хочу на курс MedAcademy.")}
          target="_blank"
          rel="noopener noreferrer"
          className="ma-btn hidden min-h-12 px-5 text-sm sm:inline-flex"
        >
          {t("cta")}
        </a>
      </div>
    </header>
  );
}

const ELEMENTS: { sym: string; name: string; num: string; note: string; tone: string }[] = [
  { sym: "Ch", name: "Химия", num: "67", note: "видеолекций", tone: "bg-[#8d66ff] text-white" },
  { sym: "Bi", name: "Биология", num: "78", note: "видеолекций", tone: "bg-[#e995be] text-[#191337]" },
  { sym: "Md", name: "Медвуз", num: "189", note: "максимум DTM", tone: "bg-[#cff846] text-[#191337]" },
];

function Hero() {
  const t = useT();
  const title = t("bTitle");
  const [left, rest] = title.split(" + ");
  const [middle, right] = (rest ?? "").split(" = ");

  return (
    <section id="top" className="relative isolate -mt-[4.75rem] overflow-hidden pt-[4.75rem]">
      <Molecules />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-12 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-ma-ink-2 ring-1 ring-white/10">
            <IconB name="pin" className="h-4 w-4 text-ma-accent" />
            Ташкент · с {brand.since} года
          </p>
          <h1 className="ma-display mt-6 text-5xl sm:text-6xl lg:text-7xl">
            {right ? (
              <>
                {left} <span className="text-[#e995be]">+</span> {middle} <span className="text-ma-accent">=</span>{" "}
                <span className="text-ma-accent">{right}</span>
              </>
            ) : (
              title
            )}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ma-ink-2">{t("bSub")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={tgHref("Привет! Хочу на курс MedAcademy.")} target="_blank" rel="noopener noreferrer" className="ma-btn min-h-14 px-7 text-lg">
              <IconB name="tg" className="h-6 w-6" />
              {t("cta")}
            </a>
            <a href="#test" className="ma-btn ma-btn-ghost min-h-14 px-7 text-lg">
              Экспресс-тест · 60 сек
            </a>
          </div>
          <ul className="mt-12 grid grid-cols-3 gap-3 sm:max-w-lg">
            {ELEMENTS.map((element, index) => (
              <In key={element.sym} as="li" variant="drop" index={index}>
                <div className={cn("flex aspect-square flex-col justify-between rounded-2xl p-3 sm:p-4", element.tone)}>
                  <span className="ma-num text-xs font-bold opacity-80">{element.num}</span>
                  <span className="ma-display text-4xl normal-case sm:text-5xl">{element.sym}</span>
                  <span className="text-xs font-bold leading-tight">
                    {element.name}
                    <span className="block font-normal opacity-80">{element.note}</span>
                  </span>
                </div>
              </In>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:col-span-5">
          <div className="ma-float relative rotate-[-3deg]" style={{ "--r": "-3deg" } as React.CSSProperties}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] ring-8 ring-white">
              <Image src={photos.chem} alt="Рашид Валиулин, преподаватель химии MedAcademy" fill priority sizes="(min-width: 1024px) 34vw, 88vw" className="object-cover" />
            </div>
            <span className="absolute -left-3 top-8 z-10 rotate-[-8deg] rounded-full bg-ma-accent px-4 py-2 text-sm font-bold text-ma-accent-ink shadow-lg">
              179,2 из 189
            </span>
            <span className="absolute -right-2 bottom-10 z-10 rotate-[6deg] rounded-full bg-[#e995be] px-4 py-2 text-sm font-bold text-[#191337] shadow-lg">
              IELTS 7,5
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Молекулы за первым экраном: точки и связи на canvas 2D. Двигаются только
 * пока видны, при «уменьшить движение» рисуются один раз и стоят. Слой не
 * ловит нажатия и не читается вслух.
 */
function Molecules() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [wrap, visible] = useOnScreen<HTMLDivElement>("0px");

  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext("2d");
    if (!node || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const small = window.innerWidth < 768;
    const count = small ? 16 : 30;
    let w = 0;
    let h = 0;
    const resize = () => {
      w = node.clientWidth;
      h = node.clientHeight;
      node.width = w * dpr;
      node.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const dots = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: index % 5 === 0 ? 5 : 2.5,
      c: ["#cff846", "#8d66ff", "#e995be", "#7dc2e3"][index % 4],
    }));
    const reach = small ? 110 : 150;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i += 1) {
        for (let j = i + 1; j < dots.length; j += 1) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const d = Math.hypot(dx, dy);
          if (d < reach) {
            ctx.strokeStyle = `rgba(229,228,238,${(0.22 * (1 - d / reach)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      for (const dot of dots) {
        ctx.fillStyle = dot.c;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };
    if (reducedMotion() || !visible) {
      draw();
      return;
    }
    let frame = 0;
    const step = () => {
      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > w) dot.vx *= -1;
        if (dot.y < 0 || dot.y > h) dot.vy *= -1;
      }
      draw();
      frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [visible]);

  return (
    <div ref={wrap} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <canvas ref={canvas} className="h-full w-full opacity-70" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ma-bg to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */

const TICKER = [
  "180,5 из 189 — автор курса химии",
  "179,2 из 189",
  "USMLE Step 1 и 2",
  "IELTS 7,5",
  "140+ видеолекций",
  "Чат с наставником",
  "Поддержка 24/7",
  `${brand.graduates} выпускников в медвузах`,
  "Шахрисабз, 16А",
];

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden bg-ma-accent py-4 text-ma-accent-ink motion-reduce:overflow-x-auto" aria-label="Коротко о MedAcademy">
      <ul className="ma-marquee flex w-max gap-8 whitespace-nowrap">
        {row.map((item, index) => (
          <li key={index} aria-hidden={index >= TICKER.length} className="ma-display flex items-center gap-8 text-xl">
            {item}
            <IconB name="molecule" className="h-6 w-6" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const TEST = [
  { q: "Сколько хромосом в соматической клетке человека?", options: ["23", "46", "48"], a: 1, topic: "Биология" },
  { q: "Какая органелла синтезирует основную часть АТФ?", options: ["Рибосома", "Митохондрия", "Лизосома"], a: 1, topic: "Биология" },
  { q: "Формула глюкозы", options: ["C₆H₁₂O₆", "C₁₂H₂₂O₁₁", "CH₃COOH"], a: 0, topic: "Химия" },
  { q: "Какой газ выделяется, если цинк опустить в соляную кислоту?", options: ["Кислород", "Хлор", "Водород"], a: 2, topic: "Химия" },
  { q: "pH нейтрального раствора при 25 °C", options: ["0", "7", "14"], a: 1, topic: "Химия" },
];

/** Экспресс-тест: пять вопросов, ответ виден сразу, в конце — конфетти. */
function ExpressTest() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= TEST.length;
  const item = TEST[Math.min(index, TEST.length - 1)];

  const choose = (option: number) => {
    if (picked !== null) return;
    setPicked(option);
    if (option === item.a) setScore((value) => value + 1);
  };
  const next = () => {
    const last = index + 1 >= TEST.length;
    setIndex(index + 1);
    setPicked(null);
    if (last && score >= 3) burst();
  };

  return (
    <section id="test" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="ma-eyebrow text-ma-accent">Экспресс-тест</p>
            <h2 className="ma-display mt-4 text-4xl sm:text-5xl">5 вопросов. 60 секунд. Без регистрации.</h2>
            <p className="ma-muted mt-6 max-w-md">
              Вопросы школьной программы — разминка перед настоящими тестами в формате DTM на курсе.
            </p>
          </div>
          <div className="ma-card relative overflow-hidden p-6 sm:p-8 lg:col-span-7">
            {!done ? (
              <div key={index} className="ma-pop">
                <div className="flex items-center justify-between text-sm">
                  <span className="rounded-full bg-white/10 px-3 py-1">{item.topic}</span>
                  <span className="ma-num ma-muted">
                    {index + 1} / {TEST.length}
                  </span>
                </div>
                <p className="mt-6 text-2xl font-bold sm:text-3xl">{item.q}</p>
                <div className="mt-6 grid gap-2 sm:grid-cols-3">
                  {item.options.map((option, optionIndex) => {
                    const state = picked === null ? "idle" : optionIndex === item.a ? "right" : optionIndex === picked ? "wrong" : "idle";
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => choose(optionIndex)}
                        aria-disabled={picked !== null}
                        className={cn(
                          "ma-chip min-h-14 justify-center text-lg transition-transform",
                          state === "right" && "bg-ma-accent text-ma-accent-ink shadow-none",
                          state === "wrong" && "bg-[#e995be] text-[#191337] shadow-none",
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex min-h-12 items-center justify-between gap-3" aria-live="polite">
                  <p className="text-sm">{picked === null ? "" : picked === item.a ? "Верно!" : `Правильно: ${item.options[item.a]}`}</p>
                  {picked !== null ? (
                    <button type="button" onClick={next} className="ma-btn">
                      {index + 1 < TEST.length ? "Дальше" : "Результат"}
                    </button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="ma-pop text-center">
                <p className="ma-display text-7xl text-ma-accent">
                  <NumberFlow value={score} /> / {TEST.length}
                </p>
                <p className="mt-4 text-lg">{score >= 4 ? "Сильный старт. Дальше — задачи уровня DTM." : "Есть куда расти — для этого и курс."}</p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <a
                    href={tgHref(`Привет! Прошёл экспресс-тест на сайте: ${score} из ${TEST.length}. Хочу на курс.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ma-btn"
                  >
                    <IconB name="tg" className="h-5 w-5" />
                    Отправить результат
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setIndex(0);
                      setScore(0);
                    }}
                    className="ma-btn ma-btn-ghost"
                  >
                    Ещё раз
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Block({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <In variant="slide">
          <p className="ma-eyebrow text-ma-accent">{kicker}</p>
          <h2 className="ma-display mt-4 max-w-4xl text-3xl sm:text-5xl">{title}</h2>
        </In>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Courses() {
  const [active, setActive] = useState<Course["id"]>("both");
  const course = courses.find((entry) => entry.id === active)!;
  const icon: Record<Course["id"], IconNameB> = { chem: "flask", bio: "dna", both: "molecule" };

  return (
    <section id="courses" className="scroll-mt-24 bg-ma-deep text-ma-on-deep">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <p className="ma-eyebrow text-[#5d2fcc]">Курсы</p>
        <h2 className="ma-display mt-4 text-4xl sm:text-5xl">Выбери формулу</h2>
        <div role="tablist" aria-label="Курсы" className="mt-8 inline-flex flex-wrap gap-1 rounded-full bg-[#191337] p-1">
          {courses.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={active === entry.id}
              onClick={() => setActive(entry.id)}
              className={cn(
                "min-h-12 rounded-full px-5 text-sm font-bold transition-colors",
                active === entry.id ? "bg-ma-accent text-ma-accent-ink" : "text-[#e5e4ee] hover:text-white",
              )}
            >
              {entry.name}
            </button>
          ))}
        </div>

        <div key={course.id} role="tabpanel" className="ma-pop mt-8 grid gap-4 lg:grid-cols-12">
          <div className="rounded-[1.5rem] bg-[#191337] p-6 text-[#e5e4ee] sm:p-10 lg:col-span-7">
            <IconB name={icon[course.id]} className="h-12 w-12 text-ma-accent" />
            <h3 className="ma-display mt-6 text-4xl sm:text-5xl">{course.name}</h3>
            <p className="mt-4 max-w-xl text-[#cfcde0]">{course.intro}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {course.learn.map((item) => (
                <li key={item} className="rounded-full bg-white/10 px-3 py-1.5 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            {[
              ["Часов", course.hours, "bg-[#8d66ff] text-white"],
              ["Видеолекций", course.lectures, "bg-[#e995be] text-[#191337]"],
              ["Файлов", course.files, "bg-[#7dc2e3] text-[#191337]"],
              ["Уровень", course.level, "bg-white text-[#191337]"],
            ].map(([label, value, tone]) => (
              <div key={label} className={cn("rounded-[1.5rem] p-5", tone)}>
                <p className="text-sm font-bold opacity-80">{label}</p>
                <p className={cn("ma-display ma-num mt-2", label === "Уровень" ? "text-xl normal-case" : "text-3xl")}>{value}</p>
              </div>
            ))}
            <div className="flex flex-col justify-between rounded-[1.5rem] bg-ma-accent p-5 text-ma-accent-ink sm:col-span-2">
              <p className="text-sm font-bold">Стоимость</p>
              <p className="ma-display ma-num mt-2 text-4xl">
                <NumberFlow value={course.price} locales="ru-RU" /> сум
              </p>
              <a
                href={tgHref(`Привет! Хочу на курс «${course.name}» (${sum(course.price)}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#191337] px-6 font-bold text-white transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
              >
                Записаться
                <IconB name="arrow" className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <p className="mt-6 flex flex-wrap gap-2 text-sm">
          {courseFeatures.map((feature) => (
            <span key={feature} className="inline-flex items-center gap-1.5 rounded-full bg-[#191337]/10 px-3 py-1.5">
              <IconB name="check" className="h-4 w-4" />
              {feature}
            </span>
          ))}
        </p>
        <div className="mt-12 text-ma-ink">
          <Addon id="pay">
            <Pay v="b" />
          </Addon>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Teachers() {
  const [flipped, setFlipped] = useState<string | null>(null);
  return (
    <section id="teachers" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <In variant="slide">
          <p className="ma-eyebrow text-ma-accent">Преподаватели</p>
          <h2 className="ma-display mt-4 max-w-4xl text-4xl sm:text-5xl">Сдали сами. Научат и тебя.</h2>
          <p className="ma-muted mt-4">Нажми на карточку — на обороте баллы и регалии.</p>
        </In>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher, index) => {
            const on = flipped === teacher.id;
            return (
              <In key={teacher.id} as="li" variant="tilt" index={index} className="[perspective:1200px]">
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={`${teacher.name}: ${on ? "показать фото" : "показать баллы и регалии"}`}
                  onClick={() => setFlipped(on ? null : teacher.id)}
                  className="ma-flip relative block aspect-[3/4] w-full text-left"
                  data-flipped={on}
                >
                  <span className="absolute inset-0 overflow-hidden rounded-[1.5rem] bg-ma-surface-2">
                    <Image src={teacher.photo} alt="" fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw" className="object-cover object-top" />
                    <span className="absolute inset-x-3 bottom-3 rounded-2xl bg-[#191337]/90 p-4">
                      <span className="block text-xs font-bold uppercase tracking-wider text-ma-accent">{teacher.subject}</span>
                      <span className="mt-1 block text-lg font-bold text-white">{teacher.name}</span>
                    </span>
                    {teacher.score ? (
                      <span className="absolute right-3 top-3 rounded-full bg-ma-accent px-3 py-1.5 text-sm font-bold text-ma-accent-ink">
                        {teacher.score.split(" / ")[0]}
                      </span>
                    ) : null}
                  </span>
                  <span className="ma-back absolute inset-0 flex flex-col rounded-[1.5rem] bg-[#8d66ff] p-6 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider">{teacher.role}</span>
                    <span className="ma-display mt-2 text-2xl">{teacher.name}</span>
                    {teacher.score ? (
                      <span className="mt-6">
                        <span className="ma-display ma-num block text-6xl text-ma-accent">{teacher.score.split(" / ")[0]}</span>
                        <span className="text-sm">{teacher.score.includes("/") ? "из 189 при поступлении" : "балл при поступлении"}</span>
                      </span>
                    ) : null}
                    <span className="mt-auto space-y-1 text-sm">
                      {teacher.facts.map((fact) => (
                        <span key={fact} className="flex gap-2">
                          <IconB name="check" className="h-4 w-4 shrink-0" />
                          {fact}
                        </span>
                      ))}
                    </span>
                  </span>
                </button>
              </In>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Reviews() {
  const goose = reviews.find((review) => review.name === "Александра");
  const row = [...reviews, ...reviews];
  return (
    <section id="reviews" className="scroll-mt-24 overflow-hidden py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <In variant="slide">
          <p className="ma-eyebrow text-ma-accent">Отзывы</p>
          <h2 className="ma-display mt-4 max-w-4xl text-4xl sm:text-5xl">«Тут и весело, и при этом хорошо учат»</h2>
          <p className="ma-muted mt-3 text-sm">Махмуд, 03.02.2026 · отзывы с сайта medacademy.uz</p>
        </In>
      </div>
      <div className="mt-10 overflow-hidden motion-reduce:overflow-x-auto">
        <ul className="ma-marquee flex w-max gap-4 px-4 [animation-duration:70s]">
          {row.map((review, index) => (
            <li key={index} aria-hidden={index >= reviews.length} className="ma-card w-[min(22rem,82vw)] shrink-0 p-6">
              <p className="ma-display text-xl text-ma-accent">«{review.quote}»</p>
              <p className="mt-3 text-sm text-ma-ink-2">{review.text}</p>
              <p className="ma-muted mt-4 text-sm">
                <b className="text-ma-ink">{review.name}</b> · {review.date}
              </p>
            </li>
          ))}
        </ul>
      </div>
      {goose ? (
        <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
          <In variant="drop" className="inline-block rotate-[-2deg] rounded-[1.5rem] bg-[#e995be] p-6 text-[#191337]">
            <p className="ma-display text-2xl">«Особая любовь к гусю Геннадию»</p>
            <p className="mt-2 text-sm">{goose.name}, {goose.date}. Что за гусь — расскажут в центре.</p>
          </In>
        </div>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Contacts() {
  const t = useT();
  return (
    <section id="contacts" className="scroll-mt-24 px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2rem] bg-ma-accent p-6 text-ma-accent-ink sm:p-10 lg:grid-cols-2 lg:p-14">
        <div>
          <p className="ma-eyebrow">{t("contacts")}</p>
          <h2 className="ma-display mt-4 text-5xl sm:text-6xl">Пиши. Ответим и подберём курс.</h2>
          <a
            href={tgHref("Привет! Хочу узнать про курсы MedAcademy.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-full bg-[#191337] px-7 text-lg font-bold text-white transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
          >
            <IconB name="tg" className="h-6 w-6" />@{contacts.telegram}
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["pin", "Адрес", contacts.address, mapHref],
            ["phone", "Телефон", contacts.phone, contacts.phoneHref],
            ["clock", "Часы работы", contacts.hours, null],
            ["mail", "Почта", contacts.email, `mailto:${contacts.email}`],
          ].map(([icon, label, value, href]) => (
            <div key={label} className="rounded-[1.5rem] bg-[#191337]/10 p-5">
              <IconB name={icon as IconNameB} className="h-6 w-6" />
              <p className="mt-3 text-sm font-bold opacity-80">{label}</p>
              <p className="mt-1 break-words font-bold">
                {href ? (
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
      <Image src="/images/medacademy/logo-white.png" alt="MedAcademy" width={485} height={323} className="h-11 w-auto" />
      <p className="ma-muted text-xs sm:mx-auto">© MedAcademy. Макет — DevUz. Логотип, фото, цены и отзывы — с medacademy.uz.</p>
      <div className="flex gap-2">
        {[
          ["tg", `https://t.me/${contacts.telegram}`, "Telegram"],
          ["ig", contacts.instagram, "Instagram"],
          ["yt", contacts.youtube, "YouTube"],
        ].map(([icon, href, label]) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10">
            <IconB name={icon as IconNameB} className="h-5 w-5" />
          </a>
        ))}
      </div>
    </footer>
  );
}
