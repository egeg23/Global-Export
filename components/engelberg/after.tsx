"use client";

import { useState } from "react";

import { brand, catalog } from "@/content/engelberg/site";

/**
 * Финал после истории: спокойная заявка и контакты с их сайта.
 *
 * Форма — часть макета: заявка никуда не уходит, показывается только
 * благодарность. Подключение к их почте или CRM — работа по договору.
 */
export function After({ backdrop }: { backdrop?: string } = {}) {
  const [sent, setSent] = useState(false);

  return (
    <section
      id="eb-contact"
      className={`eb-after${backdrop ? " eb-after-photo" : ""}`}
      style={backdrop ? ({ "--eb-backdrop": `url(${backdrop})` } as React.CSSProperties) : undefined}
    >
      <div className="eb-after-grid">
        <div>
          <p className="eb-eyebrow">Консультация и замер</p>
          <h2 className="eb-h">Материал нужно видеть вживую</h2>
          <p className="eb-p">
            Оставьте запрос — команда Engelberg поможет подобрать систему под архитектуру, климат, бюджет, размер
            проёма и технические требования объекта.
          </p>
          <div className="eb-contacts" style={{ marginTop: "2.5rem" }}>
            <a href={brand.phoneHref}>{brand.phone}</a>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </div>
        </div>

        {sent ? (
          <div aria-live="polite">
            <p className="eb-eyebrow">Запрос принят</p>
            <p className="eb-h3">Спасибо. Команда Engelberg свяжется с вами, чтобы договориться о замере.</p>
            <p className="eb-p">В макете заявка никуда не отправляется — так будет выглядеть ответ на сайте.</p>
          </div>
        ) : (
          <form
            className="eb-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <label>
              Имя
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Телефон
              <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
            </label>
            <label>
              Объект и проём
              <textarea name="note" rows={3} placeholder="Например: вилла, окна в пол, 6 проёмов" />
            </label>
            <label className="eb-check">
              <input type="checkbox" required /> Даю согласие на обработку персональных данных
            </label>
            <button type="submit" className="eb-submit">
              Оставить запрос
            </button>
          </form>
        )}
      </div>

      <footer className="eb-foot">
        <span>©2026 ENGELBERG</span>
        <span>{catalog.join(" · ")}</span>
      </footer>
    </section>
  );
}
