"use client";

import { useEffect } from "react";

/**
 * Сдерживание, а не защита.
 *
 * Правый клик по снимку, перетаскивание картинки на рабочий стол, F12 и
 * Ctrl+U перехватываются — это останавливает случайного, но не того, кто
 * откроет исходник через меню браузера или скачает страницу целиком. Всё, что
 * попало в браузер, скопировать можно; настоящая граница — код доступа в
 * прокси, до отдачи разметки. Здесь — метка в консоли для тех, кто туда
 * всё-таки заглянул.
 */
export function Guard() {
  useEffect(() => {
    const media = (target: EventTarget | null) =>
      target instanceof Element && target.closest("img, picture, svg, video, figure");

    const onContextMenu = (event: MouseEvent) => {
      if (media(event.target)) event.preventDefault();
    };
    const onDragStart = (event: DragEvent) => {
      if (media(event.target)) event.preventDefault();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      const mod = event.ctrlKey || event.metaKey;
      if (event.key === "F12" || (mod && (key === "U" || key === "S")) || (mod && event.shiftKey && ["I", "J", "C"].includes(key))) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown);

    console.log(
      "%cMAVERA · закрытый показ Maximov Tech%c\nМакеты, тексты и код защищены авторским правом. Использование без согласия студии запрещено.",
      "font: 600 14px system-ui; color: #ffd166",
      "font: 12px system-ui; color: #999",
    );

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
