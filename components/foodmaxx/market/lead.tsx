"use client";

import { useState } from "react";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { company } from "@/content/foodmaxx/company";

type Stage = "idle" | "sending" | "sent" | "error";

/** Заявка варианта 02: светлая карточка, тот же обработчик, что у варианта 01. */
export function MarketLead() {
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
    <section id="zayavka" className="bg-mk-green-900 py-16 lg:py-24">
      <Shell size="wide" className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <h2 className="font-mk-display text-[1.9rem] font-700 leading-[1.1] text-white sm:text-4xl">
            Пришлём прайс,
            <br />
            образцы и условия
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
            Назовите город и примерный объём. Перезваниваем в тот же день.
          </p>

          <dl className="mt-9 grid gap-5 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-white/45">Телефоны</dt>
              <dd className="mt-2 grid gap-1">
                {company.contacts.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="-my-1 w-fit py-1 font-medium tabular-nums text-white transition-colors hover:text-mk-orange-300"
                  >
                    {phone}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-white/45">Почта</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${company.contacts.email}`}
                  className="-my-1 inline-block py-1 text-white transition-colors hover:text-mk-orange-300"
                >
                  {company.contacts.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-white/45">Завод</dt>
              <dd className="mt-2 leading-relaxed text-white/75">{company.contacts.address}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {stage === "sent" ? (
            <div role="status" className="flex min-h-[20rem] flex-col justify-center rounded-mk-lg bg-white p-8">
              <p className="font-mk-display text-2xl font-700 text-mk-green-600">
                {delivered ? "Заявка принята" : "Позвоните нам"}
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-mk-ink-muted">
                {delivered ? (
                  <>Менеджер свяжется и пришлёт прайс с условиями отгрузки.</>
                ) : (
                  <>
                    Автоматический приём заявок ещё не подключён, и эта заявка до
                    менеджера не дошла. Наберите{" "}
                    <a
                      href={`tel:${company.contacts.phones[0].replace(/\s/g, "")}`}
                      className="font-semibold text-mk-green-600 underline underline-offset-4"
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
                className="mt-7 w-fit cursor-pointer text-sm text-mk-ink-subtle underline underline-offset-4 transition-colors hover:text-mk-ink"
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
              className="rounded-mk-lg bg-white p-6 sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="name" label="Ваше имя" placeholder="Азиз" required />
                <Field name="phone" label="Телефон" placeholder="+998 __ ___ __ __" required />
                <Field name="company" label="Компания" placeholder="Сеть, магазин, опт" />
                <Field name="city" label="Город" placeholder="Ташкент" />
              </div>

              <label className="mt-4 block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-mk-ink-subtle">
                  Комментарий
                </span>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Объём партии, сроки, интересующие позиции"
                  className="mt-2 w-full rounded-2xl border border-mk-line bg-mk-green-50 px-4 py-3 text-sm text-mk-ink outline-none transition-colors placeholder:text-mk-ink-subtle/70 focus-visible:border-mk-green-400"
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
                className="mt-6 w-full cursor-pointer rounded-full bg-mk-orange-500 px-7 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mk-orange-600 disabled:cursor-wait disabled:opacity-70"
              >
                {stage === "sending" ? "Отправляем…" : "Получить прайс"}
              </button>

              {stage === "error" ? (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  Заявка не ушла. Позвоните по телефону слева — ответим сразу.
                </p>
              ) : (
                <p className="mt-3 text-xs leading-relaxed text-mk-ink-subtle">
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
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-mk-ink-subtle">
        {label}
      </span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-mk-line bg-mk-green-50 px-4 py-3 text-sm text-mk-ink outline-none transition-colors placeholder:text-mk-ink-subtle/70 focus-visible:border-mk-green-400"
      />
    </label>
  );
}
