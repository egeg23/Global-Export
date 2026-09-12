"use client";

/** Кнопка печати. На бумагу не попадает — скрыта в печатных стилях. */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="pl-print-button">
      Печать / сохранить в PDF
    </button>
  );
}
