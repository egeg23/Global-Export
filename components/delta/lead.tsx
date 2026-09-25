"use client";

import { useId, useState } from "react";

import { school } from "@/content/delta/school";
import { cn } from "@/lib/cn";
import { usePick } from "@/lib/delta/pick";

/**
 * Запись на пробный урок.
 *
 * Четыре поля, и ни одного лишнего: кто вы, как позвонить, сколько ребёнку
 * и где удобнее — в классе или онлайн. Если родитель прошёл подбор, возраст
 * и ступень уже подставлены. Заявка уходит в Telegram менеджеру.
 */

const AGES = ["6–8 лет", "9–12 лет", "13–17 лет"] as const;
const FORMATS = ["В классе", "Онлайн"] as const;

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; text: string };

export function Lead() {
  const pick = usePick();
  const [format, setFormat] = useState<string>(FORMATS[0]);
  const [state, setState] = useState<State>({ kind: "idle" });
  const ids = { name: useId(), phone: useId(), note: useId() };

  // Возраст: свежий ответ подбора побеждает, но выбор родителя, сделанный
  // уже после подбора, — главнее. Поэтому выбор помнит, при каком ответе
  // подбора он сделан.
  const [manual, setManual] = useState<{ value: string; under: string | null } | null>(null);
  const pickKey = pick?.note ?? null;
  const age = manual && manual.under === pickKey ? manual.value : (pick?.ages ?? manual?.value ?? "");
  const setAge = (value: string) => setManual({ value, under: pickKey });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const phone = String(form.get("phone") ?? "");
    if ((phone.match(/\d/g) ?? []).length < 9) {
      setState({ kind: "error", text: "Проверьте номер: в нём не хватает цифр." });
      return;
    }
    setState({ kind: "sending" });
    try {
      const response = await fetch("/api/delta/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone,
          age,
          format,
          note: [pick?.note, form.get("note")].filter(Boolean).join("\n"),
          page: window.location.pathname + window.location.search,
          website: form.get("website"),
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setState({ kind: "sent" });
    } catch {
      setState({ kind: "error", text: `Не получилось отправить. Позвоните нам: ${school.phone}` });
    }
  };

  return (
    <section id="zapis" className="relative overflow-hidden bg-dl-blue px-4 py-20 text-white sm:px-6 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-[1240px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dl-lemon">Пробный урок</p>
          <h2 className="mt-3 font-dl-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Приходите на первый урок — с ребёнком
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85">
            Оставьте номер — менеджер школы перезвонит, подберёт группу и время. Или напишите сами:
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={school.phoneHref} className="dl-focus rounded-full border-[3px] border-white/70 px-5 py-2.5 font-extrabold tabular-nums hover:bg-white/10">
              {school.phone}
            </a>
            <a href={school.telegram} target="_blank" rel="noopener" className="dl-focus rounded-full border-[3px] border-white/70 px-5 py-2.5 font-extrabold hover:bg-white/10">
              Telegram-канал
            </a>
            <a href={school.chat} target="_blank" rel="noopener" className="dl-focus rounded-full border-[3px] border-white/70 px-5 py-2.5 font-extrabold hover:bg-white/10">
              Чат с родителями
            </a>
          </div>
        </div>

        <div className="dl-clay bg-white p-6 text-dl-ink sm:p-8">
          {state.kind === "sent" ? (
            <div className="dl-pop py-10 text-center" role="status">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-[3px] border-dl-ink bg-dl-green text-3xl font-black text-white">
                ✓
              </div>
              <p className="mt-5 font-dl-display text-3xl font-black">Заявка у нас!</p>
              <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-dl-ink-muted">
                Менеджер перезвонит и предложит время пробного урока. До встречи в классе!
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5">
              {pick ? (
                <p className="dl-pop rounded-2xl bg-dl-yellow-100 px-4 py-3 text-sm font-bold">
                  По подбору: ступень «{pick.step === "start" ? "Старт" : pick.step === "games" ? "Игры" : "Код"}», {pick.ages}
                </p>
              ) : null}

              <Field id={ids.name} label="Как к вам обращаться">
                <input id={ids.name} name="name" required autoComplete="name" placeholder="Имя" className="dl-input" />
              </Field>

              <Field id={ids.phone} label="Телефон">
                <input
                  id={ids.phone}
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+998 __ ___ __ __"
                  className="dl-input tabular-nums"
                />
              </Field>

              <fieldset>
                <legend className="text-sm font-extrabold">Сколько лет ребёнку</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {AGES.map((a) => (
                    <Toggle key={a} on={age === a} onClick={() => setAge(a)}>
                      {a}
                    </Toggle>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-extrabold">Где удобнее</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {FORMATS.map((f) => (
                    <Toggle key={f} on={format === f} onClick={() => setFormat(f)}>
                      {f}
                    </Toggle>
                  ))}
                </div>
              </fieldset>

              <Field id={ids.note} label="Комментарий" hint="необязательно">
                <textarea id={ids.note} name="note" rows={2} placeholder="Например: удобно по вечерам" className="dl-input resize-none" />
              </Field>

              {/* Ловушка для роботов: человеку не видна */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />

              {state.kind === "error" ? (
                <p role="alert" className="rounded-xl bg-dl-red/10 px-4 py-3 text-sm font-bold text-dl-red">
                  {state.text}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={state.kind === "sending"}
                className="dl-press dl-focus rounded-full bg-dl-yellow px-6 py-4 text-lg font-extrabold text-dl-ink disabled:opacity-60"
              >
                {state.kind === "sending" ? "Отправляем…" : "Записаться на пробный урок"}
              </button>
              <p className="text-center text-xs text-dl-ink-muted">Нажимая кнопку, вы соглашаетесь, что мы позвоним по этому номеру.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-extrabold">
        {label}
        {hint ? <span className="ml-2 font-semibold text-dl-ink-muted">{hint}</span> : null}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "dl-focus min-h-11 rounded-full border-[3px] px-4 py-2 text-sm font-bold transition-all",
        on ? "border-dl-ink bg-dl-yellow shadow-[0_3px_0_0_#10214A]" : "border-dl-line text-dl-ink-muted hover:border-dl-ink hover:text-dl-ink",
      )}
    >
      {children}
    </button>
  );
}
