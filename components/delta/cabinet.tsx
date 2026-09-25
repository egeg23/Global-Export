"use client";

import { useEffect, useRef, useState } from "react";

import { Coin } from "@/components/delta/deltcoin";
import { cn } from "@/lib/cn";

/**
 * Кабинет родителя — то, что делает сайт платформой.
 *
 * Главный вопрос родителя после оплаты — «он там учится или играет?». Сейчас
 * ответ приходит сообщениями в чат и на экзамене. Здесь показано, как тот же
 * ответ будет жить в одном месте: неделя, прогресс, проекты, Deltcoin.
 *
 * Это демонстрация: ребёнок и цифры — пример, так и подписано. Настоящие
 * данные подставятся, когда школа начнёт вести уроки в платформе.
 */

const TABS = ["Неделя", "Прогресс", "Проекты", "Deltcoin"] as const;
type Tab = (typeof TABS)[number];

const SKILLS = [
  { name: "Логика", value: 72, color: "#FFD84A" },
  { name: "Алгоритмы", value: 58, color: "#04BD62" },
  { name: "Слепая печать", value: 41, color: "#5BA8FF" },
  { name: "IT-английский", value: 30, color: "#E5322D" },
];

export function Cabinet() {
  const [tab, setTab] = useState<Tab>("Неделя");
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Вкладки листаются сами, пока телефон на экране и человек их не трогал.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setSeen(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setTab((current) => TABS[(TABS.indexOf(current) + 1) % TABS.length]);
    }, 3800);
    return () => window.clearInterval(id);
  }, [auto, seen]);

  const pick = (next: Tab) => {
    setAuto(false);
    setTab(next);
  };

  return (
    <section id="roditelyam" className="bg-dl-sky-100 px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1240px] gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dl-blue">Онлайн-платформа</p>
          <h2 className="mt-3 max-w-xl font-dl-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Учится он или играет — видно с телефона
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-dl-ink-muted">
            Всё, что сейчас приходит сообщениями в чат, собрано в кабинете родителя: когда урок, что задано,
            что получилось и сколько монет до приза.
          </p>

          <ul className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            {[
              ["Неделя", "Посещения, домашние тренажёры и слово преподавателя после урока"],
              ["Прогресс", "Логика, алгоритмы, печать и английский — не оценки, а рост"],
              ["Проекты", "Игры и анимации ребёнка — открыть и поиграть"],
              ["Deltcoin", "Баланс и сколько осталось до приза"],
            ].map(([t, d]) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => pick(t as Tab)}
                  className={cn(
                    "dl-focus h-full w-full rounded-2xl border-[3px] p-4 text-left transition-all",
                    tab === t ? "border-dl-ink bg-white shadow-[0_5px_0_0_#10214A]" : "border-transparent bg-white/60 hover:bg-white",
                  )}
                >
                  <span className="font-dl-display text-lg font-black">{t}</span>
                  <span className="mt-1 block text-sm leading-snug text-dl-ink-muted">{d}</span>
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-dl-ink/40 px-3 py-1.5 text-xs font-bold text-dl-ink-muted">
            <span className="h-2 w-2 rounded-full bg-dl-red" aria-hidden="true" />
            Демонстрация: ребёнок и цифры в кабинете — пример
          </p>
        </div>

        {/* Телефон */}
        <div ref={ref} className="relative mx-auto w-full max-w-[22rem]">
          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-3xl border-[3px] border-dl-ink bg-dl-yellow" aria-hidden="true" />
          <div className="absolute -bottom-5 -right-5 h-20 w-20 rounded-full border-[3px] border-dl-ink bg-dl-green" aria-hidden="true" />

          <div className="dl-clay relative overflow-hidden rounded-[2.4rem] bg-white p-3">
            <div className="rounded-[1.9rem] border-[3px] border-dl-ink bg-dl-paper">
              {/* Шапка кабинета */}
              <div className="flex items-center gap-3 rounded-t-[1.6rem] bg-dl-blue px-4 pb-4 pt-5 text-white">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border-[3px] border-dl-ink bg-dl-yellow font-dl-display text-lg font-black text-dl-ink">
                  А
                </span>
                <div className="min-w-0">
                  <p className="font-dl-display text-base font-black leading-tight">Амир, 10 лет</p>
                  <p className="text-xs text-white/75">Ступень «Игры» · группа 2</p>
                </div>
                <span className="ml-auto flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-xs font-extrabold">
                  <Coin className="h-4 w-4" />
                  420
                </span>
              </div>

              <div role="tablist" aria-label="Разделы кабинета" className="flex gap-1 border-b-2 border-dl-line px-2 pt-2">
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => pick(t)}
                    className={cn(
                      "dl-focus flex-1 rounded-t-xl px-1 py-2 text-[0.72rem] font-extrabold transition-colors",
                      tab === t ? "bg-white text-dl-blue" : "text-dl-ink-muted hover:text-dl-ink",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div role="tabpanel" className="h-[22rem] overflow-hidden bg-white p-4">
                <div key={tab} className="dl-pop h-full">
                  {tab === "Неделя" ? <Week /> : tab === "Прогресс" ? <Progress /> : tab === "Проекты" ? <Projects /> : <Coins />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Week() {
  const days = [
    { d: "Пн", s: "был" },
    { d: "Ср", s: "был" },
    { d: "Пт", s: "сегодня" },
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {days.map((day) => (
          <div
            key={day.d}
            className={cn(
              "rounded-xl border-2 p-2 text-center",
              day.s === "был" ? "border-dl-green bg-dl-green/10" : "border-dl-blue bg-dl-sky-100",
            )}
          >
            <p className="font-dl-display text-sm font-black">{day.d}</p>
            <p className={cn("text-[0.68rem] font-bold", day.s === "был" ? "text-dl-green-700" : "text-dl-blue")}>
              {day.s === "был" ? "✓ на уроке" : "урок сегодня"}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-dl-paper p-3">
        <p className="text-[0.68rem] font-extrabold uppercase tracking-wider text-dl-ink-muted">Дома</p>
        <ul className="mt-2 grid gap-1.5 text-sm">
          <li className="flex items-center gap-2">
            <span className="grid h-4 w-4 place-items-center rounded border-2 border-dl-ink bg-dl-green text-[0.55rem] font-black text-white">✓</span>
            Клавиатурный тренажёр · 15 мин
          </li>
          <li className="flex items-center gap-2">
            <span className="h-4 w-4 rounded border-2 border-dl-ink bg-white" />
            Тренажёр для мозга · 2 задачи
          </li>
        </ul>
      </div>
      <div className="flex-1 rounded-xl border-2 border-dl-ink bg-dl-yellow-100 p-3">
        <p className="text-[0.68rem] font-extrabold uppercase tracking-wider text-dl-ink-muted">Преподаватель после урока</p>
        <p className="mt-1.5 text-sm leading-snug">
          «Сегодня сам собрал уровень с циклом, без подсказки. Дома — повторить печать, в пятницу начнём игру.»
        </p>
      </div>
    </div>
  );
}

function Progress() {
  return (
    <div className="flex h-full flex-col">
      <p className="text-[0.68rem] font-extrabold uppercase tracking-wider text-dl-ink-muted">За месяц</p>
      <ul className="mt-3 grid gap-4">
        {SKILLS.map((skill, i) => (
          <li key={skill.name}>
            <div className="flex justify-between text-sm font-bold">
              <span>{skill.name}</span>
              <span className="tabular-nums text-dl-ink-muted">{skill.value}%</span>
            </div>
            <div className="mt-1.5 h-3.5 overflow-hidden rounded-full border-2 border-dl-ink bg-dl-paper">
              <div
                className="h-full origin-left rounded-full"
                style={{
                  width: `${skill.value}%`,
                  background: skill.color,
                  animation: `dl-grow 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 120}ms both`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-auto rounded-xl bg-dl-green/10 p-3 text-sm font-bold text-dl-green-700">
        +18% к алгоритмам с прошлого месяца
      </p>
    </div>
  );
}

function Projects() {
  const items = [
    { t: "Ракета и звёзды", k: "анимация", c: "#5BA8FF", done: true },
    { t: "Лабиринт", k: "игра", c: "#04BD62", done: true },
    { t: "Кликер", k: "игра · в работе", c: "#FFD84A", done: false },
  ];
  return (
    <ul className="grid h-full content-start gap-3">
      {items.map((item) => (
        <li key={item.t} className="flex items-center gap-3 rounded-xl border-2 border-dl-line p-2.5">
          <span className="grid h-14 w-16 shrink-0 place-items-center rounded-lg border-2 border-dl-ink" style={{ background: item.c }}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path d="M5 4 L20 12 L5 20 Z" fill="#fff" stroke="#10214A" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="font-dl-display text-sm font-black">{item.t}</p>
            <p className="text-xs text-dl-ink-muted">{item.k}</p>
          </div>
          <span className={cn("ml-auto text-xs font-extrabold", item.done ? "text-dl-green-700" : "text-dl-ink-muted")}>
            {item.done ? "Играть" : "…"}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Coins() {
  return (
    <div className="flex h-full flex-col items-center text-center">
      <Coin className="h-16 w-16" />
      <p className="mt-2 font-dl-display text-4xl font-black tabular-nums">420</p>
      <p className="text-sm font-bold text-dl-ink-muted">Deltcoin на счету</p>
      <div className="mt-5 w-full rounded-xl border-2 border-dl-green bg-dl-green/10 p-3 text-left">
        <p className="text-sm font-extrabold text-dl-green-700">Мини-колонка JBL — можно забрать</p>
        <p className="text-xs text-dl-ink-muted">400 Deltcoin</p>
      </div>
      <div className="mt-3 w-full rounded-xl border-2 border-dl-line p-3 text-left">
        <div className="flex justify-between text-sm font-extrabold">
          <span>Беспроводная мышь</span>
          <span className="text-dl-ink-muted">ещё 180</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-dl-ink bg-dl-paper">
          <div className="h-full origin-left rounded-full bg-dl-yellow" style={{ width: "70%", animation: "dl-grow 0.9s ease-out both" }} />
        </div>
      </div>
    </div>
  );
}
