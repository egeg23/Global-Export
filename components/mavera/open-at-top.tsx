"use client";

import { useEffect } from "react";

/**
 * Вариант открывается с первого экрана, а не с середины.
 *
 * Браузер сам возвращает прокрутку туда, где страницу оставили: при
 * перезагрузке читателю это удобно, но на стенде выглядит поломкой —
 * заказчик обновляет страницу, чтобы посмотреть свежую правку, и попадает в
 * середину сайта вместо кадра. Поэтому при заходе и перезагрузке наверх
 * встаём сами.
 *
 * Два исключения, и оба важнее нас. «Назад» и «вперёд» не трогаем: там
 * возврат на прежнее место — ровно то, чего ждут. Якорь в адресе тоже
 * сильнее: ссылка на `#commerce` должна открывать коммерцию.
 *
 * Восстановление в Chrome происходит не одним движением, а по мере того как
 * кадры занимают место: страница подрастает — браузер доводит прокрутку.
 * Поэтому мало встать наверх один раз; секунду после захода мы держим верх и
 * отменяем чужие сдвиги. Как только человек сам тронул колесо, экран или
 * клавиши — отпускаем: перебивать живую прокрутку нельзя.
 */
export function OpenAtTop() {
  useEffect(() => {
    if (window.location.hash) return;

    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (entry?.type === "back_forward") return;

    let touched = false;
    const mark = () => {
      touched = true;
    };
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    for (const event of events) window.addEventListener(event, mark, { passive: true });

    // `instant`, а не `auto`: у документа включена плавная прокрутка, и
    // «наверх» проехало бы через всю страницу на глазах у зрителя.
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const hold = () => {
      if (touched || window.scrollY === 0) return;
      toTop();
    };

    toTop();
    const frame = requestAnimationFrame(toTop);
    window.addEventListener("scroll", hold, { passive: true });
    // Секунды хватает: дальше тянет уже не восстановление, а человек.
    const release = window.setTimeout(() => window.removeEventListener("scroll", hold), 1200);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(release);
      window.removeEventListener("scroll", hold);
      for (const event of events) window.removeEventListener(event, mark);
    };
  }, []);

  return null;
}
