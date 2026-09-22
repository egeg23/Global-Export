"use client";

import { useState } from "react";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { company } from "@/content/foodmaxx/company";

type Stage = "idle" | "sending" | "sent" | "error";

/**
 * Заявка дистрибьютора.
 *
 * Пока канал доставки не подключён, форма честно пишет, что заявка не дошла,
 * и зовёт позвонить: «спасибо» на потерянную заявку — это обман, за который
 * платит заказчик.
 */
export function FoodmaxxContact() {
  const [stage, setStage] = useState<Stage>("idle");
  const [delivered, setDelivered] = useState(false);

  async function send(form: HTMLFormElement) {
    const data = new FormData(form);
    setStage("sending");
    try {
      const response = await fetch("/api/foodmaxx/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          company: data.get("company"),
          city: data.get("city"),
          note: data.get("note"),
          website: data.get("website"),
          page: window.location.pathname,
        }),
      });
      const body = (await response.json()) as { ok?: boolean; delivered?: boolean };
      if (!response.ok || !body.ok) {
        setStage("error");
        return;
      }
      setDelivered(Boolean(body.delivered));
      setStage("sent");
      form.reset();
    } catch {
      setStage("error");
    }
  }

  return (
    <section id="kontakty" className="relative bg-fm-ink-950 py-20 lg:py-28">
      <div aria-hidden="true" className="fm-spot pointer-events-none absolute inset-0 opacity-50" />

      <Shell size="wide" className="relative grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-fm-amber-400">
            Контакты
          </p>
          <h2 className="mt-5 font-fm-display text-[2rem] font-600 leading-[1.05] sm:text-[2.6rem]">
            Поставим партию
            <br />
            <span className="fm-amber-text">в ваш магазин</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-fm-cream-50/68 sm:text-base">
            Назовите город и примерный объём — вышлем прайс, образцы и условия
            отгрузки.
          </p>

          <dl className="mt-10 grid gap-7 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-fm-cream-50/50">Телефоны</dt>
              <dd className="mt-2 grid gap-1">
                {company.contacts.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="-my-1 w-fit py-1 tabular-nums text-fm-cream-50 transition-colors hover:text-fm-amber-400"
                  >
                    {phone}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-fm-cream-50/50">Почта</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${company.contacts.email}`}
                  className="-my-1 inline-block py-1 text-fm-cream-50 transition-colors hover:text-fm-amber-400"
                >
                  {company.contacts.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-fm-cream-50/50">Завод</dt>
              <dd className="mt-2 leading-relaxed text-fm-cream-50/80">
                {company.contacts.address}
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {stage === "sent" ? (
            <div
              role="status"
              className="fm-glass fm-glass-sheen flex min-h-[22rem] flex-col items-start justify-center rounded-fm-lg p-8"
            >
              <p className="font-fm-display text-3xl font-600 text-fm-amber-400">
                {delivered ? "Заявка принята" : "Позвоните нам"}
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-fm-cream-50/72">
                {delivered ? (
                  <>Менеджер свяжется и пришлёт прайс с условиями отгрузки.</>
                ) : (
                  <>
                    Автоматический приём заявок ещё не подключён, и эта заявка до
                    менеджера не дошла. Наберите{" "}
                    <a
                      href={`tel:${company.contacts.phones[0].replace(/\s/g, "")}`}
                      className="underline underline-offset-4"
                    >
                      {company.contacts.phones[0]}
                    </a>{" "}
                    — ответим сразу.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() => setStage("idle")}
                className="mt-8 cursor-pointer text-sm text-fm-cream-50/60 underline underline-offset-4 transition-colors hover:text-fm-cream-50"
              >
                Отправить ещё одну
              </button>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void send(event.currentTarget);
              }}
              className="fm-glass fm-glass-sheen rounded-fm-lg p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="name" label="Ваше имя" placeholder="Азиз" required />
                <Field name="phone" label="Телефон" placeholder="+998 __ ___ __ __" required />
                <Field name="company" label="Компания" placeholder="Сеть, магазин, опт" />
                <Field name="city" label="Город" placeholder="Ташкент" />
              </div>

              <label className="mt-5 block">
                <span className="text-xs uppercase tracking-[0.16em] text-fm-cream-50/50">
                  Комментарий
                </span>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Объём партии, сроки, интересующие позиции"
                  className="mt-2 w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-fm-cream-50 outline-none transition-colors placeholder:text-fm-cream-50/35 focus-visible:border-fm-amber-500"
                />
              </label>

              {/* Ловушка для роботов: человек её не видит и не заполняет */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-px w-px opacity-0"
              />

              <button
                type="submit"
                disabled={stage === "sending"}
                className="mt-7 w-full cursor-pointer rounded-full bg-fm-amber-500 px-7 py-4 text-sm font-medium text-fm-ink-950 transition-colors duration-300 hover:bg-fm-amber-400 disabled:cursor-wait disabled:opacity-70"
              >
                {stage === "sending" ? "Отправляем…" : "Отправить заявку"}
              </button>

              {stage === "error" ? (
                <p role="alert" className="mt-4 text-sm text-fm-tomato-400">
                  Заявка не ушла. Позвоните по телефону слева — ответим сразу.
                </p>
              ) : (
                <p className="mt-4 text-xs leading-relaxed text-fm-cream-50/45">
                  Перезваниваем в тот же день.
                </p>
              )}
            </form>
          )}
        </div>
      </Shell>
    </section>
  );
}

function Field({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.16em] text-fm-cream-50/50">{label}</span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-fm-cream-50 outline-none transition-colors placeholder:text-fm-cream-50/35 focus-visible:border-fm-amber-500"
      />
    </label>
  );
}
