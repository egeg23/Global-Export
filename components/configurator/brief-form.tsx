"use client";

import { useState } from "react";

import { useConfigurator } from "@/components/configurator/context";
import { shareUrl } from "@/components/configurator/store";
import { cn } from "@/lib/cn";
import { blocks, tierOf } from "@/lib/configurator/catalog";

/**
 * «Отправить бриф» — форма в доке.
 *
 * Из браузера уходит только набор: вариант, блоки и контакт. Сумму сервер
 * витрины считает сам по прайсу, которого в браузере нет, и передаёт бриф в
 * студию, где он становится заявкой и попадает в Telegram. Посетителю сумма
 * не показывается ни здесь, ни в ответе: витрина — публичное портфолио.
 * В ответ приходит номер и ссылка на бота — там ассистент уточняет сроки и
 * контент, зная состав заказа. Ссылка рисуется обычной кнопкой-ссылкой, а не
 * открывается скриптом: окно после запроса браузер считает всплывающим и
 * режет.
 */

type Sent = { requestNo?: string; botUrl?: string; contact: string };

export function BriefForm({ onBack }: { onBack: () => void }) {
  const ctx = useConfigurator();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<Sent | null>(null);

  if (!ctx) return null;

  // Состав одной строкой: «вариант «Премиум» и ещё 2 блока».
  const tier = tierOf(ctx.catalog, ctx.tier);
  const setLine = `вариант «${tier.label}»${ctx.extras ? ` и ещё ${blocks(ctx.extras)}` : ""}`;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!contact.trim()) {
      setError("Оставьте контакт — Telegram, телефон или почту.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/showcase/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: ctx.catalog.project,
          tier: ctx.tier,
          addons: [...ctx.enabled],
          name,
          contact,
          comment,
          website,
          page: window.location.href,
          share: shareUrl(ctx.catalog, ctx.enabled),
        }),
      });
      const json = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        requestNo?: string;
        botUrl?: string;
      };
      if (!response.ok || !json.ok) {
        setError(
          json.error === "rate_limited"
            ? "Слишком часто. Подождите минуту и попробуйте снова."
            : json.error === "validation"
              ? "Проверьте контакт: нужен Telegram, телефон или почта."
              : "Не удалось отправить. Попробуйте ещё раз или напишите нам напрямую.",
        );
        return;
      }
      setSent({ requestNo: json.requestNo, botUrl: json.botUrl, contact: contact.trim() });
    } catch {
      setError("Нет связи с сервером. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="px-5 py-5" role="status">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#ffd166]">Бриф отправлен</p>
        <h3 className="mt-2 font-sans text-lg font-medium">
          {sent.requestNo ? (
            <>
              Заявка <span className="tabular-nums">{sent.requestNo}</span>
            </>
          ) : (
            "Заявка у нас"
          )}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#f2efe9]/70">
          Выбранный состав — {setLine} — уже у студии.
          {sent.botUrl
            ? " Продолжите в Telegram: ассистент уточнит сроки и материалы, а дальше подключится менеджер."
            : ` Мы напишем вам: ${sent.contact}.`}
        </p>
        {sent.botUrl ? (
          <a
            href={sent.botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#2aabee] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Продолжить в Telegram →
          </a>
        ) : null}
        <button
          type="button"
          onClick={onBack}
          className="mt-3 w-full rounded-full border border-white/15 px-4 py-2.5 text-sm text-[#f2efe9]/80 transition-colors hover:border-white/40 hover:text-[#f2efe9]"
        >
          Вернуться к конструктору
        </button>
      </div>
    );
  }

  const field =
    "mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#f2efe9] outline-none placeholder:text-[#f2efe9]/35 focus:border-[#ffd166]/70";

  return (
    <form onSubmit={submit} className="px-5 py-4" noValidate>
      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#ffd166]">Бриф на разработку</p>
      <p className="mt-1 text-xs leading-relaxed text-[#f2efe9]/55">
        Уйдёт выбранный набор — {setLine}. Мы ответим в тот контакт, который оставите.
      </p>

      <label className="mt-3 block text-xs text-[#f2efe9]/60">
        Как к вам обращаться
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={field}
          placeholder="Имя"
          maxLength={120}
        />
      </label>

      <label className="mt-3 block text-xs text-[#f2efe9]/60">
        Контакт
        <input
          type="text"
          name="contact"
          autoComplete="tel"
          required
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          className={field}
          placeholder="@telegram, телефон или почта"
          maxLength={200}
        />
      </label>

      <label className="mt-3 block text-xs text-[#f2efe9]/60">
        Комментарий
        <textarea
          name="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className={cn(field, "min-h-[4.5rem] resize-y")}
          placeholder="Сроки, что уже есть из материалов, вопросы"
          maxLength={1500}
        />
      </label>

      {/* Ловушка для роботов: человек это поле не видит. */}
      <label className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        Сайт
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </label>

      {error ? (
        <p role="alert" className="mt-3 text-xs leading-relaxed text-[#ff8a8a]">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="flex-1 rounded-full bg-[#ffd166] px-4 py-2.5 text-sm font-medium text-[#0b0d10] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Отправляем…" : "Отправить бриф"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-[#f2efe9]/80 transition-colors hover:border-white/40 hover:text-[#f2efe9]"
        >
          Назад
        </button>
      </div>
    </form>
  );
}
