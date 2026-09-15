"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { company } from "@/content/adar/company";
import { useCart } from "@/lib/adar/cart";
import { formatPrice } from "@/lib/adar/format";
import { cn } from "@/lib/cn";

type Stage = "list" | "sending" | "sent" | "failed";

/**
 * Корзина и оформление заявки.
 *
 * Компания продаёт партиями по перечислению, поэтому «оплатить» здесь нет:
 * посетитель набирает наборы с количествами и оставляет телефон, а счёт
 * выставляет менеджер. Заявка со всем составом уходит в Telegram.
 *
 * Сделана на теге `<dialog>`: браузер сам запирает фокус, закрывает по Esc
 * и возвращает фокус на кнопку, с которой корзину открыли.
 */
export function CartPanel() {
  const cart = useCart();
  const node = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [stage, setStage] = useState<Stage>("list");
  const [error, setError] = useState("");
  // Сервер отвечает, дошла ли заявка до менеджера. Пока бот не подключён,
  // говорим об этом прямо: «Спасибо» на потерянную заявку — обман.
  const [delivered, setDelivered] = useState(true);

  useEffect(() => {
    const dialog = node.current;
    if (!dialog || !cart) return;
    if (cart.isOpen && !dialog.open) dialog.showModal();
    if (!cart.isOpen && dialog.open) dialog.close();
  }, [cart]);

  if (!cart) return null;

  const field =
    "w-full rounded-xl border border-adar-green-900/12 bg-white px-4 py-3 text-sm text-adar-ink outline-none transition-colors duration-200 placeholder:text-adar-ink-subtle/70 focus-visible:border-adar-green-700";
  const label = "mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-adar-ink-subtle";

  async function send(form: HTMLFormElement) {
    if (!cart) return;
    const data = new FormData(form);
    setStage("sending");
    setError("");

    try {
      const response = await fetch("/api/adar/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          company: data.get("company"),
          note: data.get("note"),
          website: data.get("website"),
          page: window.location.pathname,
          items: cart.rows.map((row) => ({ slug: row.set.slug, qty: row.qty })),
        }),
      });

      const result: { ok?: boolean; delivered?: boolean } = await response
        .json()
        .catch(() => ({}));
      if (!response.ok || !result.ok) {
        setError(
          response.status === 422
            ? "Проверьте имя и телефон."
            : response.status === 429
              ? "Слишком много попыток. Попробуйте через минуту."
              : "Не удалось отправить. Позвоните нам — ответим сразу.",
        );
        setStage("failed");
        return;
      }

      setDelivered(result.delivered !== false);
      cart.clear();
      setStage("sent");
    } catch {
      setError("Нет связи с сервером. Позвоните нам — ответим сразу.");
      setStage("failed");
    }
  }

  return (
    <dialog
      ref={node}
      aria-label="Корзина"
      onClose={() => {
        cart.close();
        if (stage === "sent" || stage === "failed") setStage("list");
      }}
      onClick={(event) => {
        if (event.target === node.current) cart.close();
      }}
      className={cn(
        "m-auto w-[min(46rem,calc(100vw-2rem))] rounded-adar-lg bg-adar-cream-50 p-0",
        "backdrop:bg-adar-green-950/70 backdrop:backdrop-blur-sm",
      )}
    >
      <div className="flex max-h-[85vh] flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-adar-green-900/10 px-6 py-5 sm:px-8">
          <h2 className="font-adar-display text-2xl text-adar-green-950">
            {stage === "sent" ? "Заявка принята" : "Корзина"}
          </h2>
          <button
            type="button"
            onClick={() => cart.close()}
            className="-mr-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-adar-ink-subtle transition-colors hover:bg-adar-cream-100 hover:text-adar-ink"
          >
            <span className="sr-only">Закрыть</span>
            <span aria-hidden="true" className="text-lg leading-none">
              ×
            </span>
          </button>
        </header>

        {stage === "sent" ? (
          <div className="px-6 py-10 text-center sm:px-8">
            <p className="font-adar-display text-4xl text-adar-green-800">
              {delivered ? "Спасибо" : "Позвоните нам"}
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-adar-ink-muted">
              {delivered ? (
                <>
                  Менеджер перезвонит, подтвердит состав и выставит счёт. Работаем ежедневно
                  с 8:00 до 23:00.
                </>
              ) : (
                <>
                  Автоматический приём заявок ещё не подключён, и эта заявка до менеджера не
                  дошла. Наберите{" "}
                  <a
                    href={`tel:${company.contacts.phones[2].replace(/\s/g, "")}`}
                    className="underline underline-offset-4"
                  >
                    {company.contacts.phones[2]}
                  </a>{" "}
                  — ответим сразу.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => cart.close()}
              className="mt-8 cursor-pointer rounded-full bg-adar-green-900 px-7 py-3.5 text-sm font-medium text-adar-cream-50 transition-colors hover:bg-adar-green-800"
            >
              Хорошо
            </button>
          </div>
        ) : cart.rows.length === 0 ? (
          <div className="px-6 py-12 text-center sm:px-8">
            <p className="text-sm text-adar-ink-muted">
              Пока пусто. Откройте любой набор в каталоге — там состав, вес и кнопка
              «в корзину».
            </p>
            <button
              type="button"
              onClick={() => cart.close()}
              className="mt-6 cursor-pointer rounded-full border border-adar-green-900/15 px-6 py-3 text-sm text-adar-ink transition-colors hover:border-adar-green-700"
            >
              К каталогу
            </button>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ul className="px-6 sm:px-8">
              {cart.rows.map((row) => (
                <li
                  key={row.set.slug}
                  // Одна раскладка на все ширины: картинка слева, всё
                  // остальное колонкой, которая на большом экране
                  // разворачивается в строку.
                  className="flex items-start gap-3 border-b border-adar-green-900/8 py-4 last:border-b-0 sm:items-center sm:gap-4"
                >
                  <Image
                    src={row.set.image}
                    alt=""
                    width={80}
                    height={80}
                    className="h-14 w-14 shrink-0 rounded-xl bg-adar-cream-100 object-contain p-1.5 sm:h-16 sm:w-16"
                  />

                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-4">
                    <div className="min-w-0 sm:flex-1">
                      <p className="text-sm leading-snug text-adar-ink">{row.set.name}</p>
                      <p className="mt-0.5 text-xs tabular-nums text-adar-ink-subtle">
                        {formatPrice(row.set.price)} за набор
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 sm:mt-0 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => cart.setQty(row.set.slug, row.qty - 1)}
                        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-adar-green-900/12 text-adar-ink transition-colors hover:border-adar-green-700 sm:h-8 sm:w-8"
                      >
                        <span className="sr-only">Убрать один «{row.set.name}»</span>
                        <span aria-hidden="true">−</span>
                      </button>
                      <label className="sr-only" htmlFor={`${id}-${row.set.slug}`}>
                        Количество «{row.set.name}»
                      </label>
                      <input
                        id={`${id}-${row.set.slug}`}
                        type="number"
                        min={1}
                        value={row.qty}
                        onChange={(event) =>
                          cart.setQty(row.set.slug, Number(event.target.value) || 1)
                        }
                        className="w-14 shrink-0 rounded-lg border border-adar-green-900/12 bg-white px-1 py-1.5 text-center text-sm tabular-nums text-adar-ink outline-none focus-visible:border-adar-green-700 sm:w-16 sm:px-2"
                      />
                      <button
                        type="button"
                        onClick={() => cart.setQty(row.set.slug, row.qty + 1)}
                        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-adar-green-900/12 text-adar-ink transition-colors hover:border-adar-green-700 sm:h-8 sm:w-8"
                      >
                        <span className="sr-only">Добавить один «{row.set.name}»</span>
                        <span aria-hidden="true">+</span>
                      </button>

                      <p className="min-w-0 flex-1 whitespace-nowrap text-right text-xs font-medium tabular-nums text-adar-green-800 sm:w-32 sm:flex-none sm:text-sm">
                        {formatPrice(row.sum)}
                      </p>

                      <button
                        type="button"
                        onClick={() => cart.remove(row.set.slug)}
                        className="-mr-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-adar-ink-subtle transition-colors hover:bg-adar-cream-100 hover:text-adar-ink"
                      >
                        <span className="sr-only">Убрать «{row.set.name}» из корзины</span>
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void send(event.currentTarget);
              }}
              className="border-t border-adar-green-900/10 bg-adar-cream-100/60 px-6 py-6 sm:px-8"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-adar-ink-subtle">
                  Наборов: <span className="tabular-nums">{cart.count}</span>
                </span>
                <span className="font-adar-display text-2xl tabular-nums text-adar-green-950">
                  {formatPrice(cart.total)}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
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

              <div className="mt-4">
                <label className={label} htmlFor={`${id}-company`}>
                  Организация
                </label>
                <input
                  id={`${id}-company`}
                  name="company"
                  className={field}
                  placeholder="Необязательно"
                />
              </div>

              <div className="mt-4">
                <label className={label} htmlFor={`${id}-note`}>
                  Комментарий
                </label>
                <textarea
                  id={`${id}-note`}
                  name="note"
                  rows={2}
                  className={cn(field, "resize-none")}
                  placeholder="Логотип на коробке, отгрузка до 20 декабря"
                />
              </div>

              {/* Ловушка для роботов: человек её не видит и не заполняет */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-px w-px opacity-0"
              />

              {error ? (
                <p role="alert" className="mt-4 text-sm text-adar-red-600">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={stage === "sending"}
                className="mt-5 w-full cursor-pointer rounded-full bg-adar-green-900 px-7 py-3.5 text-sm font-medium text-adar-cream-50 transition-colors duration-300 hover:bg-adar-green-800 disabled:cursor-wait disabled:opacity-70"
              >
                {stage === "sending" ? "Отправляем…" : "Оставить заявку"}
              </button>

              <p className="mt-3 text-xs leading-relaxed text-adar-ink-subtle">
                Оплата по счёту: менеджер подтвердит состав и пришлёт документы.
              </p>
            </form>
          </div>
        )}
      </div>
    </dialog>
  );
}
