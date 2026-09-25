"use client";

import { useEffect, useRef, useState } from "react";

import { PICK_EVENT } from "@/components/akbar/configurator";
import { company } from "@/content/akbar/company";

const TOPICS = ["Расчёт стоимости", "Консультация дизайнера", "Дилерство", "Заказ для объекта"] as const;

type Status = "idle" | "sending" | "done" | "error";

/**
 * Заявка.
 *
 * Поля — только те, без которых менеджеру не перезвонить: имя, телефон и
 * тема. Набор из конструктора или модель из каталога приходят сюда сами —
 * человеку не нужно их переписывать.
 */
export function Lead() {
  const [status, setStatus] = useState<Status>("idle");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>(TOPICS[0]);
  const model = useRef<HTMLTextAreaElement>(null);
  const phone = useRef<HTMLInputElement>(null);

  // Набор из конструктора — событием; модель из каталога — параметром адреса.
  useEffect(() => {
    const put = (text: string) => {
      if (!model.current) return;
      model.current.value = text;
      model.current.dataset.filled = "1";
    };
    const fromUrl = new URLSearchParams(window.location.search).get("model");
    if (fromUrl) put(fromUrl.slice(0, 300));

    const onPick = (event: Event) => {
      put((event as CustomEvent<string>).detail);
      setTopic("Расчёт стоимости");
      window.setTimeout(() => phone.current?.focus({ preventScroll: true }), 700);
    };
    window.addEventListener(PICK_EVENT, onPick);
    return () => window.removeEventListener(PICK_EVENT, onPick);
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch("/api/akbar/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          topic,
          model: form.get("model"),
          website: form.get("website"),
          page: window.location.pathname,
        }),
      });
      setStatus(response.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="zayavka" className="ak-grain relative scroll-mt-16 overflow-hidden bg-ak-ink px-4 py-20 text-ak-ivory sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="relative mx-auto grid max-w-[100rem] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <p className="ak-eyebrow text-ak-gold-300">Заявка</p>
          <h2 className="mt-4 font-ak-display text-5xl font-medium leading-[0.98] sm:text-6xl">
            Рассчитаем двери для вашего дома
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ak-ivory/70">
            Оставьте телефон — менеджер перезвонит, уточнит размеры и назовёт стоимость. Консультация
            бесплатная.
          </p>
          <div className="mt-10 grid gap-2">
            {company.phones.map((item) => (
              <a key={item.href} href={item.href} className="w-fit font-ak-display text-3xl font-medium tabular-nums hover:text-ak-gold-300">
                {item.label}
              </a>
            ))}
            <p className="mt-2 text-sm text-ak-ivory/55">{company.schedule[0].hours.join(" · ")}</p>
          </div>
        </div>

        {status === "done" ? (
          <div role="status" className="grid place-items-center rounded-[2rem] border border-ak-gold/40 bg-ak-ivory/5 p-10 text-center">
            <div>
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ak-gold text-ak-ink">
                <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <p className="mt-6 font-ak-display text-4xl font-medium">Заявка принята</p>
              <p className="mx-auto mt-3 max-w-sm text-ak-ivory/70">
                Менеджер перезвонит в рабочее время отдела продаж. Ko‘ngil tinch!
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-5 rounded-[2rem] border border-ak-ivory/12 bg-ak-ivory/[0.04] p-6 sm:p-9">
            <fieldset>
              <legend className="ak-eyebrow text-ak-ivory/60">Что нужно</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {TOPICS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={topic === item}
                    onClick={() => setTopic(item)}
                    className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${
                      topic === item
                        ? "border-ak-gold bg-ak-gold text-ak-ink"
                        : "border-ak-ivory/25 hover:border-ak-ivory/60"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span className="text-ak-ivory/70">Имя</span>
                <input name="name" required autoComplete="name" className="ak-input" placeholder="Как к вам обращаться" />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="text-ak-ivory/70">Телефон</span>
                <input
                  ref={phone}
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  className="ak-input"
                  placeholder="+998 __ ___ __ __"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm">
              <span className="text-ak-ivory/70">Модель, размеры или вопрос</span>
              <textarea
                ref={model}
                name="model"
                rows={3}
                className="ak-input min-h-28 py-3.5 leading-relaxed"
                placeholder="Например: № 110 Классика, ясень, 3 двери по 2,4 м"
              />
            </label>

            {/* Ловушка для роботов: человек это поле не видит. */}
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-xs text-xs leading-relaxed text-ak-ivory/50">
                Нажимая кнопку, вы соглашаетесь, что менеджер Akbar Rich свяжется с вами по этому номеру.
              </p>
              <button type="submit" disabled={status === "sending"} className="ak-btn ak-btn-gold disabled:opacity-60">
                {status === "sending" ? "Отправляем…" : "Жду звонка"}
              </button>
            </div>
            {status === "error" && (
              <p role="alert" className="text-sm text-[#f3b49b]">
                Не получилось отправить. Позвоните нам: {company.phones[0].label}.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
