"use client";

import { useState } from "react";

import { steps, type StepId } from "@/content/delta/school";
import { cn } from "@/lib/cn";
import { announcePick } from "@/lib/delta/pick";

/**
 * Подбор ступени за три вопроса.
 *
 * Приём взят у Mars IT («бесплатный тест: какое направление подходит»), но
 * без анкеты на десять экранов: возраст, что ребёнку нравится, пробовал ли
 * уже. Ответ — ступень и одна фраза о том, с чего начнём именно с ним. Выбор
 * сразу переносится в форму записи, чтобы родитель не отвечал дважды.
 */

const AGES = [
  { id: "start", label: "6–8 лет" },
  { id: "games", label: "9–12 лет" },
  { id: "code", label: "13–17 лет" },
] as const satisfies readonly { id: StepId; label: string }[];

const LIKES = [
  { id: "games", label: "Играть в игры", note: "Начнём с того, что ему уже нравится: свои персонажи, уровни и счёт очков." },
  { id: "draw", label: "Рисовать и придумывать", note: "Начнём с анимации: нарисованный герой, который двигается по его программе." },
  { id: "logic", label: "Решать задачки", note: "Начнём с логики: головоломки на переменах и задачи, где нужно подумать, а не угадать." },
  { id: "exam", label: "Готовиться к экзамену", note: "Разберём задачи уровня ОГЭ по информатике — наш ученик сдал его на 20 из 21." },
] as const;

const EXPERIENCE = [
  { id: "zero", label: "Нет, с нуля" },
  { id: "some", label: "Немного пробовал" },
  { id: "code", label: "Да, уже пишет код" },
] as const;

type Answers = { age?: StepId; like?: (typeof LIKES)[number]["id"]; exp?: (typeof EXPERIENCE)[number]["id"] };

export function DeltaPicker() {
  const [answers, setAnswers] = useState<Answers>({});
  const ready = answers.age && answers.like && answers.exp;

  // Ступень — по возрасту; опыт сдвигает на одну вверх, но не выше «Кода».
  const stepIndex = (() => {
    if (!answers.age) return 0;
    const base = steps.findIndex((s) => s.id === answers.age);
    return answers.exp === "code" ? Math.min(base + 1, steps.length - 1) : base;
  })();
  const step = steps[stepIndex];
  const like = LIKES.find((l) => l.id === answers.like);

  const done = () => {
    if (!ready) return;
    announcePick({
      step: step.id,
      ages: AGES.find((a) => a.id === answers.age)?.label ?? "",
      note: `Подбор: ${step.name} · нравится: ${like?.label.toLowerCase()} · опыт: ${EXPERIENCE.find((e) => e.id === answers.exp)?.label.toLowerCase()}`,
    });
    document.getElementById("zapis")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="podbor" className="bg-dl-paper px-4 pb-20 sm:px-6 lg:pb-28">
      <div className="dl-clay mx-auto grid w-full max-w-[1240px] overflow-hidden bg-white lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dl-blue">Подбор за 30 секунд</p>
          <h2 className="mt-3 font-dl-display text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            С чего начать именно вашему?
          </h2>

          <Question label="Сколько лет ребёнку?">
            {AGES.map((a) => (
              <Choice key={a.id} on={answers.age === a.id} onClick={() => setAnswers((x) => ({ ...x, age: a.id }))}>
                {a.label}
              </Choice>
            ))}
          </Question>

          <Question label="Что ему нравится больше?">
            {LIKES.map((l) => (
              <Choice key={l.id} on={answers.like === l.id} onClick={() => setAnswers((x) => ({ ...x, like: l.id }))}>
                {l.label}
              </Choice>
            ))}
          </Question>

          <Question label="Уже пробовал программировать?">
            {EXPERIENCE.map((e) => (
              <Choice key={e.id} on={answers.exp === e.id} onClick={() => setAnswers((x) => ({ ...x, exp: e.id }))}>
                {e.label}
              </Choice>
            ))}
          </Question>
        </div>

        <div
          aria-live="polite"
          className={cn(
            "relative flex flex-col justify-between border-t-[3px] border-dl-ink p-6 transition-colors duration-500 sm:p-10 lg:border-l-[3px] lg:border-t-0",
            ready ? "bg-dl-blue text-white" : "bg-dl-sky-100",
          )}
        >
          {ready ? (
            <div key={`${step.id}-${answers.like}`} className="dl-pop">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/70">Ваша ступень</p>
              <p className="mt-3 font-dl-display text-5xl font-black tracking-tight">«{step.name}»</p>
              <p className="mt-2 text-lg font-semibold text-white/85">{step.lead}</p>
              <p className="mt-6 rounded-2xl bg-white/12 p-4 text-base leading-relaxed">{like?.note}</p>
              {answers.exp === "code" && stepIndex !== steps.findIndex((s) => s.id === answers.age) ? (
                <p className="mt-3 text-sm text-white/75">Ступень на одну выше возрастной — раз ребёнок уже пишет код.</p>
              ) : null}
            </div>
          ) : (
            <div className="text-dl-ink-muted">
              <p className="font-dl-display text-2xl font-black text-dl-ink">Ответьте на три вопроса</p>
              <p className="mt-2 text-base">— и здесь появится ступень и то, с чего мы начнём.</p>
              <div className="mt-8 flex gap-2" aria-hidden="true">
                {[answers.age, answers.like, answers.exp].map((v, i) => (
                  <span key={i} className={cn("h-3 flex-1 rounded-full border-2 border-dl-ink transition-colors", v ? "bg-dl-green" : "bg-white")} />
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={done}
            disabled={!ready}
            className="dl-press dl-focus mt-8 rounded-full bg-dl-yellow px-6 py-3.5 text-base font-extrabold text-dl-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Записаться на эту ступень
          </button>
        </div>
      </div>
    </section>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-7">
      <legend className="text-sm font-extrabold text-dl-ink">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "dl-focus min-h-11 rounded-full border-[3px] px-4 py-2 text-sm font-bold transition-all",
        on
          ? "-translate-y-0.5 border-dl-ink bg-dl-yellow text-dl-ink shadow-[0_4px_0_0_#10214A]"
          : "border-dl-line bg-white text-dl-ink-muted hover:border-dl-ink hover:text-dl-ink",
      )}
    >
      {children}
    </button>
  );
}
