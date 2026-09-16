"use client";

import { useState } from "react";

/**
 * Кнопка формы в демонстрации.
 *
 * Заявка никуда не уходит — на витрине так и написано. Но кнопка, которая
 * молчит, выглядит сломанной: заказчик нажимает и не понимает, сработало ли.
 * Поэтому нажатие честно отвечает тем, что увидит покупатель на готовом сайте.
 */
export function DemoSubmit({
  label,
  done,
  className,
}: {
  label: string;
  done: string;
  className?: string;
}) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p role="status" className="mv-fade border border-[var(--w-accent)] bg-[var(--w-accent-soft)] px-5 py-3.5 text-sm text-[var(--w-ink)]">
        {done}
      </p>
    );
  }

  return (
    <button type="button" onClick={() => setSent(true)} className={className}>
      {label}
    </button>
  );
}
