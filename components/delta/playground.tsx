"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Первая программа — прямо на сайте.
 *
 * Родитель спрашивает себя одно: «а моему будет интересно?». Отвечать на это
 * текстом бессмысленно, поэтому первый экран даёт попробовать самому: три
 * уровня на полминуты — последовательность, повороты и цикл, ровно в том
 * порядке, в каком эти идеи приходят на уроках. Собирается нажатиями, а не
 * перетаскиванием: на телефоне и у шестилетки это одинаково легко.
 *
 * Рядом та же программа текстом — так видно, куда ведут ступени: от блоков к
 * настоящему коду.
 */

type Dir = 0 | 1 | 2 | 3; // 0 — вправо, 1 — вниз, 2 — влево, 3 — вверх
type Cmd = "F" | "L" | "R";
type Cell = { x: number; y: number };

type Level = {
  title: string;
  idea: string;
  hint: string;
  start: Cell & { dir: Dir };
  star: Cell;
  rocks: Cell[];
  /** Программа целиком — тело цикла, который повторится `loop` раз. */
  loop?: number;
  /** Ограничение по числу блоков — заставляет искать короткое решение. */
  limit: number;
};

const COLS = 6;
const ROWS = 4;

const LEVELS: Level[] = [
  {
    title: "Последовательность",
    idea: "Компьютер выполняет команды по очереди — ровно то, что написано.",
    hint: "Звезда в трёх клетках. Нажмите «Вперёд» столько раз, сколько нужно, и запустите.",
    start: { x: 1, y: 1, dir: 0 },
    star: { x: 4, y: 1 },
    rocks: [],
    limit: 6,
  },
  {
    title: "Повороты",
    idea: "Направление — тоже команда. Ракета поворачивается на месте.",
    hint: "Звезда выше. Долетите до нужного столбца, поверните и поднимитесь.",
    start: { x: 0, y: 3, dir: 0 },
    star: { x: 3, y: 0 },
    rocks: [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 4, y: 3 },
    ],
    limit: 8,
  },
  {
    title: "Цикл",
    idea: "Одинаковые шаги не пишут трижды — их повторяют. Это цикл.",
    hint: "Соберите одну ступеньку лестницы: вперёд, налево, вперёд, направо. Цикл повторит её три раза.",
    start: { x: 1, y: 3, dir: 0 },
    star: { x: 4, y: 0 },
    rocks: [
      { x: 4, y: 3 },
      { x: 5, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ],
    loop: 3,
    limit: 5,
  },
];

const STEP_MS = 360;

const LABEL: Record<Cmd, string> = { F: "Вперёд", L: "Налево", R: "Направо" };
const CODE: Record<Cmd, string> = { F: "вперёд()", L: "налево()", R: "направо()" };

const move = (cell: Cell, dir: Dir): Cell => {
  if (dir === 0) return { x: cell.x + 1, y: cell.y };
  if (dir === 1) return { x: cell.x, y: cell.y + 1 };
  if (dir === 2) return { x: cell.x - 1, y: cell.y };
  return { x: cell.x, y: cell.y - 1 };
};

type Pose = Cell & { dir: Dir; spin: number };
type Status =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "crash"; text: string }
  | { kind: "short"; text: string }
  | { kind: "win" };

/** Четыре квадрата глобуса из их знака — они же конфетти победы. */
const CONFETTI = ["#FCE93A", "#04BD62", "#E5322D", "#5BA8FF"];

export function Playground({ onFinish }: { onFinish?: () => void }) {
  const [level, setLevel] = useState(0);
  const [program, setProgram] = useState<Cmd[]>([]);
  const [pose, setPose] = useState<Pose>(() => ({ ...LEVELS[0].start, spin: 0 }));
  const [active, setActive] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  const current = LEVELS[level];
  const blocks = program.length + (current.loop ? 1 : 0);
  const full = blocks >= current.limit;
  const running = status.kind === "running";

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const resetPose = useCallback(
    (index = level) => {
      clearTimers();
      setPose({ ...LEVELS[index].start, spin: 0 });
      setActive(null);
      setStatus({ kind: "idle" });
    },
    [clearTimers, level],
  );

  const add = (cmd: Cmd) => {
    if (running || full) return;
    if (status.kind !== "idle") resetPose();
    setProgram((list) => [...list, cmd]);
  };

  const undo = () => {
    if (running) return;
    resetPose();
    setProgram((list) => list.slice(0, -1));
  };

  const clear = () => {
    if (running) return;
    resetPose();
    setProgram([]);
  };

  const goTo = (index: number) => {
    clearTimers();
    setLevel(index);
    setProgram([]);
    setPose({ ...LEVELS[index].start, spin: 0 });
    setActive(null);
    setStatus({ kind: "idle" });
  };

  const run = () => {
    if (running || program.length === 0) return;
    clearTimers();

    // Разворачиваем программу в плоский список шагов — с номером блока,
    // который подсвечивается, пока шаг идёт.
    const plan: { cmd: Cmd; index: number }[] = [];
    const times = current.loop ?? 1;
    for (let round = 0; round < times; round++) {
      program.forEach((cmd, index) => plan.push({ cmd, index }));
    }

    let state: Pose = { ...current.start, spin: 0 };
    setPose(state);
    setStatus({ kind: "running" });

    const rocks = new Set(current.rocks.map((c) => `${c.x}:${c.y}`));

    plan.forEach((step, i) => {
      const id = window.setTimeout(
        () => {
          setActive(step.index);
          if (step.cmd === "F") {
            const next = move(state, state.dir);
            const out = next.x < 0 || next.y < 0 || next.x >= COLS || next.y >= ROWS;
            if (out || rocks.has(`${next.x}:${next.y}`)) {
              clearTimers();
              // Ракета «вздрагивает» на месте удара: полшага вперёд и назад.
              setPose({ ...state, x: state.x + (next.x - state.x) * 0.35, y: state.y + (next.y - state.y) * 0.35 });
              const back = window.setTimeout(() => setPose(state), 160);
              timers.current.push(back);
              setStatus({
                kind: "crash",
                text: out ? "Ракета вылетела за поле. Проверьте, сколько клеток до края." : "Бум! Впереди астероид. Где-то нужен поворот.",
              });
              setActive(null);
              return;
            }
            state = { ...state, ...next };
          } else {
            const turn = step.cmd === "L" ? -1 : 1;
            state = { ...state, dir: (((state.dir + turn) % 4) + 4) % 4 as Dir, spin: state.spin + turn * 90 };
          }
          setPose(state);

          if (i === plan.length - 1) {
            const end = window.setTimeout(() => {
              setActive(null);
              if (state.x === current.star.x && state.y === current.star.y) {
                setStatus({ kind: "win" });
                if (level === LEVELS.length - 1) {
                  setDone(true);
                  onFinish?.();
                }
              } else {
                setStatus({ kind: "short", text: "Почти! Ракета остановилась, не долетев до звезды. Добавьте команд." });
              }
            }, STEP_MS);
            timers.current.push(end);
          }
        },
        (i + 1) * STEP_MS,
      );
      timers.current.push(id);
    });
  };

  const code = useMemo(() => {
    if (program.length === 0) return current.loop ? [`повторить(${current.loop}):`, "    …"] : ["…"];
    if (current.loop) return [`повторить(${current.loop}):`, ...program.map((c) => `    ${CODE[c]}`)];
    return program.map((c) => CODE[c]);
  }, [program, current.loop]);

  const cellPct = { w: 100 / COLS, h: 100 / ROWS };

  return (
    <div className="dl-clay overflow-hidden bg-white">
      {/* Верх: уровни */}
      <div className="flex items-center justify-between gap-3 border-b-[3px] border-dl-ink bg-dl-blue px-4 py-3 text-white">
        <p className="font-dl-display text-sm font-extrabold tracking-wide">Первая программа</p>
        <ol className="flex items-center gap-1.5" aria-label="Уровни">
          {LEVELS.map((item, index) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => goTo(index)}
                disabled={running}
                aria-current={index === level ? "step" : undefined}
                className={cn(
                  "dl-focus grid h-8 min-w-8 place-items-center rounded-full border-2 px-2 text-xs font-extrabold transition-colors",
                  index === level
                    ? "border-white bg-dl-yellow text-dl-ink"
                    : "border-white/40 text-white/80 hover:border-white hover:text-white",
                )}
              >
                {index + 1}
                <span className="sr-only">. {item.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
        {/* Поле */}
        <div className="border-b-[3px] border-dl-ink bg-dl-sky-100 p-4 lg:border-b-0 lg:border-r-[3px]">
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-dl-blue">
            Уровень {level + 1} · {current.title}
          </p>
          <p className="mt-1 text-sm leading-snug text-dl-ink-muted">{current.hint}</p>

          <div
            className="dl-grid-paper relative mt-3 aspect-[6/4] w-full overflow-hidden rounded-2xl border-[3px] border-dl-ink bg-white"
            role="img"
            aria-label={`Поле ${COLS} на ${ROWS}: ракета, звезда${current.rocks.length ? " и астероиды" : ""}`}
          >
            {current.rocks.map((rock) => (
              <Rock key={`${rock.x}:${rock.y}`} style={{ left: `${rock.x * cellPct.w}%`, top: `${rock.y * cellPct.h}%`, width: `${cellPct.w}%`, height: `${cellPct.h}%` }} />
            ))}

            <div
              className="absolute grid place-items-center"
              style={{ left: `${current.star.x * cellPct.w}%`, top: `${current.star.y * cellPct.h}%`, width: `${cellPct.w}%`, height: `${cellPct.h}%` }}
            >
              <Star won={status.kind === "win"} />
              {status.kind === "win" ? <Confetti key={`${level}-win`} /> : null}
            </div>

            <div
              className="absolute grid place-items-center transition-[left,top] duration-300 ease-out motion-reduce:transition-none"
              style={{ left: `${pose.x * cellPct.w}%`, top: `${pose.y * cellPct.h}%`, width: `${cellPct.w}%`, height: `${cellPct.h}%` }}
            >
              <div
                className={cn("transition-transform duration-300 ease-out motion-reduce:transition-none", status.kind === "crash" && "dl-wiggle")}
                style={{ transform: `rotate(${pose.spin + [0, 90, 180, 270][current.start.dir]}deg)` }}
              >
                <Rocket />
              </div>
            </div>

          </div>

          <p
            aria-live="polite"
            className={cn(
              "mt-3 min-h-[2.75rem] rounded-xl px-3 py-2 text-sm font-semibold leading-snug",
              status.kind === "win" && "bg-dl-green/15 text-dl-green-700",
              (status.kind === "crash" || status.kind === "short") && "bg-dl-red/10 text-dl-red",
              (status.kind === "idle" || status.kind === "running") && "bg-white/70 text-dl-ink-muted",
            )}
          >
            {status.kind === "win"
              ? done
                ? "Все три уровня! Последовательность, повороты и цикл — три главные идеи программирования."
                : `Есть! ${current.idea}`
              : status.kind === "crash" || status.kind === "short"
                ? status.text
                : status.kind === "running"
                  ? "Ракета выполняет программу…"
                  : current.idea}
          </p>
        </div>

        {/* Программа */}
        <div className="flex flex-col p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-dl-ink-muted">Команды</p>
            <p className={cn("text-xs font-bold tabular-nums", full ? "text-dl-red" : "text-dl-ink-muted")}>
              блоков {blocks} из {current.limit}
            </p>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["F", "L", "R"] as Cmd[]).map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => add(cmd)}
                disabled={running || full}
                className={cn(
                  "dl-block dl-focus flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[0.78rem] font-extrabold leading-none text-dl-ink transition-transform active:translate-y-1 disabled:opacity-40",
                  cmd === "F" ? "bg-dl-yellow" : cmd === "L" ? "bg-dl-sky" : "bg-dl-green text-white",
                )}
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  {cmd === "F" ? "↑" : cmd === "L" ? "↺" : "↻"}
                </span>
                {LABEL[cmd]}
              </button>
            ))}
          </div>

          {/* Собранная программа */}
          <div className="mt-4 min-h-[8.5rem] flex-1 rounded-2xl border-2 border-dashed border-dl-line bg-dl-paper p-2.5">
            {current.loop ? (
              <div className="rounded-xl border-[3px] border-dl-ink bg-[#ffb14a] p-2 pb-2.5">
                <p className="px-1 text-xs font-extrabold text-dl-ink">⟳ Повторить {current.loop} раза</p>
                <ProgramList program={program} active={active} nested />
              </div>
            ) : (
              <ProgramList program={program} active={active} />
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={run}
              disabled={running || program.length === 0}
              className="dl-press dl-focus flex-1 rounded-full bg-dl-blue px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50"
            >
              ▶ Запустить
            </button>
            <button
              type="button"
              onClick={undo}
              disabled={running || program.length === 0}
              className="dl-focus rounded-full border-[3px] border-dl-ink px-3 text-sm font-bold disabled:opacity-40"
              aria-label="Убрать последний блок"
            >
              ⌫
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={running || program.length === 0}
              className="dl-focus rounded-full border-[3px] border-dl-ink px-3 text-sm font-bold disabled:opacity-40"
            >
              Сброс
            </button>
          </div>

          {done ? (
            <a
              href="#zapis"
              className="dl-press dl-pop dl-focus mt-3 block rounded-2xl bg-dl-yellow px-4 py-3 text-center text-sm font-extrabold text-dl-ink"
            >
              Это была первая программа. Первая игра — на пробном уроке →
            </a>
          ) : null}

          {status.kind === "win" && level < LEVELS.length - 1 ? (
            <button
              type="button"
              onClick={() => goTo(level + 1)}
              className="dl-press dl-pop dl-focus mt-3 rounded-full bg-dl-yellow px-4 py-2.5 text-sm font-extrabold text-dl-ink"
            >
              Следующий уровень →
            </button>
          ) : null}

          {/* Та же программа текстом */}
          <details className="group mt-3 rounded-xl bg-dl-ink text-white/90">
            <summary className="dl-focus cursor-pointer list-none rounded-xl px-3 py-2 text-xs font-bold text-white/80 marker:hidden">
              <span className="mr-1 inline-block transition-transform group-open:rotate-90">›</span>
              Так это выглядит текстом — как на старшей ступени
            </summary>
            <pre className="overflow-x-auto px-3 pb-3 font-dl-mono text-[0.78rem] leading-relaxed">
              {code.map((line, i) => (
                <span key={i} className="block">
                  <span className="mr-3 select-none text-white/30">{String(i + 1).padStart(2, " ")}</span>
                  {line}
                </span>
              ))}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}

function ProgramList({ program, active, nested = false }: { program: Cmd[]; active: number | null; nested?: boolean }) {
  if (program.length === 0) {
    return (
      <p className={cn("px-1 py-3 text-center text-xs text-dl-ink-muted", nested && "rounded-lg bg-white/70")}>
        {nested ? "Нажмите команды — они встанут внутрь цикла" : "Нажмите на команды — они встанут сюда"}
      </p>
    );
  }
  return (
    <ol className={cn("flex flex-wrap gap-1.5", nested && "mt-1.5 rounded-lg bg-white/70 p-1.5")}>
      {program.map((cmd, index) => (
        <li
          key={index}
          className={cn(
            "dl-pop rounded-lg border-2 border-dl-ink px-2 py-1 text-xs font-extrabold transition-transform",
            cmd === "F" ? "bg-dl-yellow" : cmd === "L" ? "bg-dl-sky" : "bg-dl-green text-white",
            active === index && "-translate-y-1 ring-4 ring-dl-blue/40",
          )}
        >
          {LABEL[cmd]}
        </li>
      ))}
    </ol>
  );
}

/** Ракета — треугольник их знака с глобусом из четырёх квадратов. */
function Rocket() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9 drop-shadow-[0_3px_0_rgba(16,33,74,0.35)] sm:h-10 sm:w-10" aria-hidden="true">
      {/* пламя — сзади, ракета смотрит вправо */}
      <path d="M8 18 L1 24 L8 30 Z" fill="#FCE93A" stroke="#10214A" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 6 L44 24 L8 42 Z" fill="#004AAD" stroke="#10214A" strokeWidth="3" strokeLinejoin="round" />
      <rect x="13" y="18" width="6" height="6" rx="1" fill="#FCE93A" />
      <rect x="19" y="18" width="6" height="6" rx="1" fill="#04BD62" />
      <rect x="13" y="24" width="6" height="6" rx="1" fill="#E5322D" />
      <rect x="19" y="24" width="6" height="6" rx="1" fill="#5BA8FF" />
    </svg>
  );
}

function Star({ won }: { won: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-9 w-9", won ? "dl-pop" : "dl-float")} aria-hidden="true">
      <path
        d="M20 3 L25 14.5 L37.5 15.5 L28 24 L31 36.5 L20 30 L9 36.5 L12 24 L2.5 15.5 L15 14.5 Z"
        fill={won ? "#04BD62" : "#FFD84A"}
        stroke="#10214A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Rock({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute grid place-items-center" style={style} aria-hidden="true">
      <svg viewBox="0 0 40 40" className="h-8 w-8">
        <path d="M8 16 L16 7 L29 9 L35 20 L30 32 L15 34 L6 26 Z" fill="#9AA6BF" stroke="#10214A" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="17" cy="18" r="3" fill="#7C88A3" />
        <circle cx="26" cy="26" r="2.2" fill="#7C88A3" />
      </svg>
    </div>
  );
}

/** Конфетти из квадратов глобуса — разлетаются из звезды. */
function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2;
        const dist = 60 + ((i * 37) % 70);
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 20,
          r: (i * 53) % 360,
          c: CONFETTI[i % 4],
          d: (i % 5) * 30,
        };
      }),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center motion-reduce:hidden" aria-hidden="true">
      {bits.map((bit, i) => (
        <span
          key={i}
          className="absolute h-2.5 w-2.5 rounded-[3px] border border-dl-ink"
          style={
            {
              background: bit.c,
              animation: `dl-burst 0.9s cubic-bezier(0.2, 0.7, 0.3, 1) ${bit.d}ms both`,
              "--bx": `${bit.x}px`,
              "--by": `${bit.y}px`,
              "--br": `${bit.r}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
