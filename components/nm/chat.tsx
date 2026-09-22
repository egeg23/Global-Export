"use client";

import { useEffect, useRef, useState } from "react";

import { quick, replyTo } from "@/content/nm/chat";
import { cn } from "@/lib/cn";

/**
 * Чат с обещанием ответить за десять секунд.
 *
 * Обещание здесь не написано на баннере, а проверяется на глазах: как
 * только вопрос отправлен, рядом с ним запускается обратный отсчёт,
 * который видно. Менеджер отвечает раньше — и человек видит не лозунг, а
 * выполненное обещание.
 *
 * Вторая половина обещания — что будет, если не успеют. Её не прячем:
 * под перепиской стоит ссылка, которая проигрывает этот случай целиком,
 * с истёкшим таймером и промокодом на 15%. Обещание, которое нельзя
 * проверить, ничего не стоит.
 *
 * Отсчёт идёт мимо состояния React: цифра и кольцо пишутся прямо в узлы
 * через ссылки. Состояние здесь дало бы десять перерисовок в секунду
 * ради одной меняющейся цифры.
 */

type Message = {
  id: number;
  from: "them" | "us";
  text: string;
  /** За сколько секунд пришёл ответ — подпись под репликой менеджера. */
  after?: number;
};

const LIMIT_MS = 10_000;
/** Сколько на самом деле думает менеджер: быстро, но не мгновенно. */
const ANSWER_MS = [3400, 4700, 5900, 4100];

/**
 * Отсчёт всегда идёт от десяти секунд — это и есть обещание.
 *
 * Когда ответ приходит раньше, стрелку останавливают на том, что
 * осталось: «ответили за 4,7 с» видно и в цифре, и в кольце. Часы живут
 * вне компонента: они читают время и пишут в узлы, а в отрисовке такому
 * места нет.
 */
function startClock(
  counter: React.RefObject<HTMLSpanElement | null>,
  ring: React.RefObject<SVGCircleElement | null>,
  onEnd?: () => void,
) {
  const started = Date.now();
  let frame = 0;
  const paint = (left: number) => {
    if (counter.current) counter.current.textContent = (left / 1000).toFixed(1);
    if (ring.current) ring.current.style.setProperty("--nm-clock", String(left / LIMIT_MS));
  };
  const tick = () => {
    const left = Math.max(0, LIMIT_MS - (Date.now() - started));
    paint(left);
    if (left > 0) {
      frame = requestAnimationFrame(tick);
      return;
    }
    onEnd?.();
  };
  paint(LIMIT_MS);
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export function Chat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: "us",
      text: "Здравствуйте! Нигора, менеджер фабрики. Спрашивайте — отвечу за 10 секунд.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [state, setState] = useState<"idle" | "waiting" | "expired">("idle");
  const [promo, setPromo] = useState(false);

  const counter = useRef<HTMLSpanElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const turn = useRef(0);

  // Уходя, гасим всё, что было заведено: иначе ответ придёт в закрытый чат.
  useEffect(
    () => () => {
      for (const id of timers.current) window.clearTimeout(id);
    },
    [],
  );

  // Переписка всегда прокручена к последнему сообщению.
  useEffect(() => {
    const node = thread.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, state]);

  const stopClock = useRef<(() => void) | null>(null);
  const runClock = (onEnd?: () => void) => startClock(counter, ring, onEnd);

  const ask = (text: string) => {
    const question = text.trim();
    if (!question || state === "waiting") return;

    turn.current += 1;
    const id = turn.current;
    setMessages((prev) => [...prev, { id: id * 2, from: "them", text: question }]);
    setDraft("");
    setState("waiting");

    const wait = ANSWER_MS[(id - 1) % ANSWER_MS.length];
    stopClock.current?.();
    stopClock.current = runClock();

    const timer = window.setTimeout(() => {
      // Кольцо замирает на том, что осталось: это и есть доказательство.
      stopClock.current?.();
      stopClock.current = null;
      setMessages((prev) => [
        ...prev,
        { id: id * 2 + 1, from: "us", text: replyTo(question), after: wait / 1000 },
      ]);
      setState("idle");
    }, wait);
    timers.current.push(timer);
  };

  /** Проигрываем второй случай: таймер дошёл до нуля, включается скидка. */
  const showMiss = () => {
    if (state === "waiting") return;
    setState("waiting");
    setPromo(false);
    stopClock.current?.();
    stopClock.current = runClock(() => {
      setState("expired");
      setPromo(true);
    });
  };

  return (
    <>
      {/* Имя для доступности постоянное, а надпись на телефоне короче:
          полная фраза съедала треть экрана и лезла на карточки. */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="nm-chat"
        aria-label={open ? "Свернуть чат" : "Ответим за 10 секунд"}
        className={cn(
          "fixed bottom-20 right-4 z-50 flex cursor-pointer items-center gap-2 rounded-full bg-[var(--nm-teal)] py-2.5 pl-3.5 pr-4 text-white shadow-[0_18px_40px_-18px_rgba(7,40,46,0.9)] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none sm:right-6 sm:gap-2.5 sm:py-3 sm:pl-4 sm:pr-5 lg:bottom-6",
        )}
      >
        <span className="relative flex size-2.5">
          <span className="nm-pulse absolute inline-flex size-full rounded-full bg-[var(--nm-champagne)] opacity-70" />
          <span className="relative inline-flex size-2.5 rounded-full bg-[var(--nm-champagne)]" />
        </span>
        <span aria-hidden className="text-[0.8rem] font-medium sm:text-[0.86rem]">
          <span className="sm:hidden">{open ? "Свернуть" : "Ответ за 10 сек"}</span>
          <span className="hidden sm:inline">
            {open ? "Свернуть чат" : "Ответим за 10 секунд"}
          </span>
        </span>
      </button>

      {open ? (
        <section
          id="nm-chat"
          aria-label="Чат с менеджером"
          className="fixed inset-x-3 bottom-36 z-50 flex max-h-[70svh] flex-col overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] shadow-[0_30px_80px_-30px_rgba(7,40,46,0.6)] sm:inset-x-auto sm:right-6 sm:w-[24rem] lg:bottom-20"
        >
          <header className="flex items-center justify-between gap-3 border-b border-[var(--w-line)] bg-[var(--nm-teal-deep)] p-4 text-[var(--nm-champagne)]">
            <div>
              <p className="text-[0.92rem] font-medium text-white">Нигора · менеджер продаж</p>
              <p className="mt-0.5 text-[0.74rem] opacity-80">Ташкент · на связи</p>
            </div>
            <Clock counter={counter} ring={ring} running={state === "waiting"} />
          </header>

          <div ref={thread} className="flex-1 overflow-y-auto p-4">
            <ul className="grid gap-3">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className={cn(
                    "max-w-[85%] rounded-[var(--w-radius-lg)] px-4 py-3 text-[0.86rem] leading-relaxed",
                    message.from === "us"
                      ? "bg-[var(--nm-teal-soft)] text-[var(--w-ink)]"
                      : "ml-auto bg-[var(--nm-teal)] text-white",
                  )}
                >
                  {message.text}
                  {message.after ? (
                    <span className="mt-2 block text-[0.72rem] text-[var(--w-muted)]">
                      Ответили за {message.after.toFixed(1).replace(".", ",")} с — обещали за 10
                    </span>
                  ) : null}
                </li>
              ))}

              {state === "waiting" ? (
                <li className="max-w-[85%] rounded-[var(--w-radius-lg)] bg-[var(--nm-teal-soft)] px-4 py-3">
                  <span className="nm-typing" aria-label="Менеджер печатает">
                    <i />
                    <i />
                    <i />
                  </span>
                </li>
              ) : null}

              {state === "expired" && promo ? (
                <li
                  role="status"
                  className="rounded-[var(--w-radius-lg)] border border-[var(--nm-brass)] bg-[var(--w-paper)] px-4 py-3.5 text-[0.86rem] leading-relaxed"
                >
                  <b className="block text-[var(--nm-teal)]">
                    Не успели. Скидка 15% на всё — ваша.
                  </b>
                  <span className="mt-2 block text-[var(--w-muted)]">
                    Промокод{" "}
                    <b className="rounded-[var(--w-radius)] bg-[var(--nm-teal)] px-2 py-1 font-mono text-[0.82rem] text-white">
                      10SEC-15
                    </b>{" "}
                    действует на заказ, оформленный после этого разговора.
                  </span>
                </li>
              ) : null}
            </ul>

            {messages.length <= 1 && state === "idle" ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {quick.map((question) => (
                  <li key={question}>
                    <button
                      type="button"
                      onClick={() => ask(question)}
                      className="cursor-pointer rounded-full border border-[var(--w-line)] px-3.5 py-2 text-left text-[0.78rem] text-[var(--w-muted)] transition-colors hover:border-[var(--w-accent)] hover:text-[var(--w-ink)]"
                    >
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              ask(draft);
            }}
            className="flex items-center gap-2 border-t border-[var(--w-line)] p-3"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Спросите о цене, сроке или материалах"
              aria-label="Сообщение менеджеру"
              className="min-w-0 flex-1 rounded-[var(--w-radius)] border border-[var(--w-line)] bg-[var(--w-bg)] px-3.5 py-2.5 text-[0.86rem] outline-none transition-colors focus:border-[var(--w-accent)]"
            />
            <button
              type="submit"
              disabled={state === "waiting" || draft.trim() === ""}
              className="shrink-0 cursor-pointer rounded-[var(--w-radius)] bg-[var(--nm-teal)] px-4 py-2.5 text-[0.84rem] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Отправить
            </button>
          </form>

          <footer className="border-t border-[var(--w-line)] bg-[var(--w-paper)] px-4 py-3">
            <p className="text-[0.74rem] leading-relaxed text-[var(--w-muted)]">
              Это макет: отвечает не человек, а заготовленные ответы.{" "}
              <button
                type="button"
                onClick={showMiss}
                className="cursor-pointer text-[var(--nm-teal)] underline underline-offset-2"
              >
                Показать, что будет, если не ответят
              </button>
            </p>
          </footer>
        </section>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------ */

/** Обратный отсчёт: кольцо и цифра. Оба пишутся из rAF, мимо состояния. */
function Clock({
  counter,
  ring,
  running,
}: {
  counter: React.RefObject<HTMLSpanElement | null>;
  ring: React.RefObject<SVGCircleElement | null>;
  running: boolean;
}) {
  return (
    <div
      className={cn(
        "relative grid size-12 shrink-0 place-items-center transition-opacity",
        running ? "opacity-100" : "opacity-45",
      )}
    >
      <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
        <circle
          ref={ring}
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="nm-clock"
        />
      </svg>
      <span className="text-[0.78rem] tabular-nums text-white">
        <span ref={counter}>10.0</span>
      </span>
    </div>
  );
}
