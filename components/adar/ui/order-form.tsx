"use client";

import { useEffect, useId, useRef, useState } from "react";

import { ORDER_EVENT } from "@/components/adar/ui/set-dialog";
import { cn } from "@/lib/cn";

type Props = { tone?: "light" | "dark" };

/**
 * Заявка на подарки.
 *
 * В прототипе форма ничего никуда не отправляет: проверяет заполнение и
 * показывает состояние «принято». На рабочем сайте те же поля уходят
 * менеджеру письмом и мгновенным сообщением — отправка настраивается при
 * запуске, вместе с почтой компании.
 */
export function OrderForm({ tone = "light" }: Props) {
  const dark = tone === "dark";
  const id = useId();
  const [sent, setSent] = useState(false);
  const [note, setNote] = useState("");
  const noteField = useRef<HTMLTextAreaElement>(null);

  // «Заказать этот набор» в карточке товара приводит сюда: форма уже
  // заполнена названием, и посетителю остаётся оставить телефон.
  useEffect(() => {
    function onOrder(event: Event) {
      const name = (event as CustomEvent<string>).detail;
      setSent(false);
      setNote(`Интересует набор «${name}». Подскажите сроки и минимальный тираж.`);
      document.getElementById("kontakty")?.scrollIntoView({ behavior: "smooth" });
      // Фокус — после прокрутки, иначе браузер дёрнет страницу к полю сам.
      window.setTimeout(() => noteField.current?.focus(), 600);
    }

    window.addEventListener(ORDER_EVENT, onOrder);
    return () => window.removeEventListener(ORDER_EVENT, onOrder);
  }, []);

  const field = cn(
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors duration-200",
    dark
      ? "border-white/12 bg-white/5 text-adar-cream-50 placeholder:text-adar-cream-50/35 focus-visible:border-adar-gold-500"
      : "border-adar-green-900/12 bg-white text-adar-ink placeholder:text-adar-ink-subtle/70 focus-visible:border-adar-green-700",
  );

  const label = cn(
    "mb-2 block text-xs font-medium uppercase tracking-[0.14em]",
    dark ? "text-adar-cream-50/50" : "text-adar-ink-subtle",
  );

  if (sent) {
    return (
      <div
        role="status"
        className={cn(
          "flex min-h-[22rem] flex-col items-start justify-center rounded-adar border p-8",
          dark ? "border-adar-gold-500/30 bg-white/5" : "border-adar-green-900/12 bg-white",
        )}
      >
        <span className="font-adar-display text-4xl text-adar-gold-500">Спасибо</span>
        <p
          className={cn(
            "mt-4 max-w-sm text-sm leading-relaxed",
            dark ? "text-adar-cream-50/65" : "text-adar-ink-muted",
          )}
        >
          Заявка принята. Менеджер перезвонит и уточнит количество, бюджет
          на человека и сроки отгрузки.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className={cn(
            "mt-8 text-sm underline underline-offset-4",
            dark ? "text-adar-cream-50/50" : "text-adar-ink-subtle",
          )}
        >
          Отправить ещё одну
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate={false}
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className={cn(
        "grid gap-5 rounded-adar border p-6 sm:p-8",
        dark ? "border-white/10 bg-white/[0.03]" : "border-adar-green-900/10 bg-white",
      )}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={`${id}-name`}>
            Ваше имя
          </label>
          <input id={`${id}-name`} name="name" required className={field} placeholder="Азиз" />
        </div>
        <div>
          <label className={label} htmlFor={`${id}-phone`}>
            Телефон
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            required
            className={field}
            placeholder="+998 __ ___ __ __"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={`${id}-count`}>
            Количество подарков
          </label>
          <input
            id={`${id}-count`}
            name="count"
            type="number"
            min={1}
            className={field}
            placeholder="500"
          />
        </div>
        <div>
          <label className={label} htmlFor={`${id}-budget`}>
            Бюджет на подарок, сум
          </label>
          <input
            id={`${id}-budget`}
            name="budget"
            type="number"
            min={0}
            step={10000}
            className={field}
            placeholder="150 000"
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor={`${id}-note`}>
          Комментарий
        </label>
        <textarea
          ref={noteField}
          id={`${id}-note`}
          name="note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className={cn(field, "resize-none")}
          placeholder="Логотип на коробке, отгрузка до 20 декабря"
        />
      </div>

      <button
        type="submit"
        className={cn(
          "mt-1 rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-300",
          dark
            ? "bg-adar-gold-500 text-adar-green-950 hover:bg-adar-gold-400"
            : "bg-adar-green-900 text-adar-cream-50 hover:bg-adar-green-800",
        )}
      >
        Отправить заявку
      </button>

      <p
        className={cn(
          "text-xs leading-relaxed",
          dark ? "text-adar-cream-50/40" : "text-adar-ink-subtle",
        )}
      >
        Перезваниваем в тот же день. Работаем ежедневно с 8:00 до 23:00.
      </p>
    </form>
  );
}
