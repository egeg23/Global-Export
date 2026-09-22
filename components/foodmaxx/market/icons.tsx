/**
 * Иконки варианта 02.
 *
 * Нарисованы здесь, а не взяты из файлов заказчика: у него набор сборный —
 * часть контурная, часть цветная заливкой, — и в одном ряду они читаются как
 * надёрганные откуда попало. Эти сделаны в одну толщину линии и красятся
 * через `currentColor`, поэтому ряд выглядит ровно.
 */

type Props = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Огурец с листом — овощная линейка. */
export function IconVeg({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M6.5 17.5c-2.2-2.2-1.6-6.4 1.3-9.3S15 4.3 17.2 6.5s1.6 6.4-1.3 9.3-7.2 3.9-9.4 1.7Z" />
      <path d="M14.5 9.5c-1 .5-2 1.2-2.9 2.1-.9.9-1.6 1.9-2.1 2.9" />
      <path d="M17.6 6.2c.6-1.3 1.9-2 3.4-1.9.1 1.5-.6 2.8-1.9 3.4" />
    </svg>
  );
}

/**
 * Окорок на кости — мясная линейка.
 *
 * Первый вариант был из дуги и круга в середине и читался как глаз, а не
 * как мясо: у отруба узнаётся силуэт с костью, а не пятно.
 */
export function IconMeat({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M9.8 5.4c3-1.4 6.4-.4 7.9 2.3 1.5 2.7.6 6.1-2.1 7.9-1.6 1.1-2.6 2-3.1 2.9" />
      <path d="M9.8 5.4C7.4 6.6 6.2 8.5 6.6 10.3c.2 1 1 1.7 2 1.9" />
      <path d="M12.5 18.5c-.6 1-1.6 1.6-2.8 1.5a2.1 2.1 0 0 1-1.9-2.4" />
      <path d="M7.8 17.6a2.1 2.1 0 0 1-2.4-1.9c-.1-1.2.5-2.2 1.5-2.8" />
    </svg>
  );
}

/** Капля — заливка и рассол. */
export function IconDrop({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5c3.2 3.6 5.5 6.6 5.5 9.4a5.5 5.5 0 1 1-11 0c0-2.8 2.3-5.8 5.5-9.4Z" />
      <path d="M9.4 13.6a2.8 2.8 0 0 0 2.2 3.3" />
    </svg>
  );
}

/** Банка с крышкой — тара. */
export function IconJar({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <rect x="6.5" y="3.2" width="11" height="2.9" rx="1" />
      <path d="M7.5 6.1v12.3a2.4 2.4 0 0 0 2.4 2.4h4.2a2.4 2.4 0 0 0 2.4-2.4V6.1" />
      <path d="M7.5 10.6h9" />
    </svg>
  );
}

/** Паллета — приёмка сырья. */
export function IconPallet({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <rect x="7" y="4.5" width="10" height="7.5" rx="1" />
      <path d="M12 4.5V12" />
      <path d="M3.5 16h17M5.5 16v3.5M12 16v3.5M18.5 16v3.5" />
    </svg>
  );
}

/** Кран с водой — мойка. */
export function IconTap({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M4 9h6.5a3 3 0 0 1 3 3v1" />
      <path d="M13.5 9h4a2.5 2.5 0 0 1 2.5 2.5V13" />
      <path d="M11 6.5h5" />
      <path d="M13.5 6.5V9" />
      <path d="M20 16.5c0 1.1-.9 2-2 2s-2-.9-2-2 2-3.5 2-3.5 2 2.4 2 3.5Z" />
    </svg>
  );
}

/** Лупа над плодом — отбор. */
export function IconSort({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m15 15 4.5 4.5" />
      <path d="M8.4 10.6a2.2 2.2 0 0 1 2.2-2.2" />
    </svg>
  );
}

/** Часы — выдержка. */
export function IconTime({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.6V12l2.8 1.8" />
    </svg>
  );
}

/** Ветка специй — травы и тара. */
export function IconHerb({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 20V8.5" />
      <path d="M12 12.5c-2.6 0-4.4-1.7-4.4-4.4 2.6 0 4.4 1.7 4.4 4.4Z" />
      <path d="M12 9.6c0-2.6 1.7-4.4 4.4-4.4 0 2.6-1.7 4.4-4.4 4.4Z" />
    </svg>
  );
}

/** Конвейер — закладка. */
export function IconLine({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="6" width="6" height="6" rx="1" />
      <rect x="13" y="8" width="5" height="4" rx="1" />
      <path d="M3 15.5h18" />
      <circle cx="6.5" cy="18.5" r="1.6" />
      <circle cx="12" cy="18.5" r="1.6" />
      <circle cx="17.5" cy="18.5" r="1.6" />
    </svg>
  );
}

/** Градусник — пастеризация. */
export function IconHeat({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M13.8 13.6V6a1.9 1.9 0 1 0-3.8 0v7.6a3.6 3.6 0 1 0 3.8 0Z" />
      <path d="M11.9 9.5v5.6" />
    </svg>
  );
}

/** Коробка с меткой — упаковка. */
export function IconBox({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M3.8 7.6 12 4l8.2 3.6v8.8L12 20l-8.2-3.6Z" />
      <path d="m3.8 7.6 8.2 3.7 8.2-3.7" />
      <path d="M12 11.3V20" />
    </svg>
  );
}
