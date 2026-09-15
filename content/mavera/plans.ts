/**
 * Библиотека планировок.
 *
 * Раньше планировка выбиралась по количеству комнат и отражалась зеркально —
 * получалось четыре картинки на весь дом. Так не бывает: у двухкомнатной в
 * 52 метра и в 66 разная логика, а не разный масштаб. В компактной кухня
 * объединена с гостиной, в просторной — отдельная, и это видно на чертеже.
 *
 * Комнаты заданы прямоугольниками в системе 320×220 (примерно 10 единиц на
 * полметра). Площадь комнаты не хранится: она считается долей от площади
 * квартиры, поэтому подписи всегда сходятся с метражом в карточке — сколько
 * бы вариантов мы ни нарисовали.
 */

export type Room = {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Мокрая зона — рисуется плиткой. */
  wet?: boolean;
};

export type Plan = {
  id: string;
  name: string;
  /** Как называть квартиру этого типа в заголовке. */
  short: string;
  rooms: number;
  /** Диапазон площадей, для которых эта планировка имеет смысл. */
  from: number;
  to: number;
  /** Чем она отличается — строка для карточки. */
  note: string;
  layout: Room[];
  balconies: { x: number; y: number; w: number; h: number }[];
  /** Где входная дверь — рисуется створка. */
  entry: { x: number; y: number };
};

export const plans: Plan[] = [
  {
    id: "studio",
    short: "Студия",
    name: "Студия",
    rooms: 1,
    from: 0,
    to: 39,
    note: "Одно пространство, мокрая зона у входа",
    layout: [
      { label: "Кухня-гостиная", x: 20, y: 20, w: 180, h: 180 },
      { label: "Прихожая", x: 200, y: 20, w: 100, h: 66 },
      { label: "Санузел", x: 200, y: 86, w: 100, h: 58, wet: true },
      { label: "Гардероб", x: 200, y: 144, w: 100, h: 56 },
    ],
    balconies: [{ x: 20, y: 200, w: 180, h: 18 }],
    entry: { x: 300, y: 53 },
  },
  {
    id: "one-room",
    short: "1-комнатная",
    name: "1-комнатная",
    rooms: 1,
    from: 39,
    to: 100,
    note: "Отдельная кухня и изолированная комната",
    layout: [
      { label: "Гостиная", x: 20, y: 20, w: 170, h: 112 },
      { label: "Кухня", x: 20, y: 132, w: 170, h: 68 },
      { label: "Прихожая", x: 190, y: 20, w: 110, h: 62 },
      { label: "Санузел", x: 190, y: 82, w: 110, h: 60, wet: true },
      { label: "Кладовая", x: 190, y: 142, w: 110, h: 58 },
    ],
    balconies: [{ x: 20, y: 200, w: 170, h: 18 }],
    entry: { x: 300, y: 51 },
  },
  {
    id: "two-compact",
    short: "2-комнатная",
    name: "2-комнатная, компакт",
    rooms: 2,
    from: 0,
    to: 58,
    note: "Кухня объединена с гостиной — спальня остаётся изолированной",
    layout: [
      { label: "Кухня-гостиная", x: 20, y: 20, w: 165, h: 116 },
      { label: "Спальня", x: 20, y: 136, w: 165, h: 64 },
      { label: "Прихожая", x: 185, y: 20, w: 115, h: 56 },
      { label: "Санузел", x: 185, y: 76, w: 115, h: 60, wet: true },
      { label: "Гардероб", x: 185, y: 136, w: 115, h: 64 },
    ],
    balconies: [{ x: 20, y: 200, w: 165, h: 18 }],
    entry: { x: 300, y: 48 },
  },
  {
    id: "two-classic",
    short: "2-комнатная",
    name: "2-комнатная, классика",
    rooms: 2,
    from: 58,
    to: 100,
    note: "Кухня отдельно, две изолированные комнаты, два санузла",
    layout: [
      { label: "Кухня", x: 20, y: 20, w: 112, h: 92 },
      { label: "Гостиная", x: 132, y: 20, w: 168, h: 92 },
      { label: "Спальня", x: 20, y: 112, w: 142, h: 88 },
      { label: "Прихожая", x: 162, y: 112, w: 62, h: 88 },
      { label: "Санузел", x: 224, y: 112, w: 76, h: 44, wet: true },
      { label: "С/у гостевой", x: 224, y: 156, w: 76, h: 44, wet: true },
    ],
    balconies: [{ x: 132, y: 200, w: 168, h: 18 }],
    entry: { x: 193, y: 200 },
  },
  {
    id: "three-family",
    short: "3-комнатная",
    name: "3-комнатная, семейная",
    rooms: 3,
    from: 0,
    to: 82,
    note: "Кухня-гостиная и две спальни, санузел рядом с детской",
    layout: [
      { label: "Кухня-гостиная", x: 20, y: 20, w: 162, h: 106 },
      { label: "Спальня", x: 182, y: 20, w: 118, h: 106 },
      { label: "Детская", x: 20, y: 126, w: 122, h: 74 },
      { label: "Прихожая", x: 142, y: 126, w: 78, h: 74 },
      { label: "Санузел", x: 220, y: 126, w: 80, h: 74, wet: true },
    ],
    balconies: [{ x: 20, y: 200, w: 162, h: 18 }],
    entry: { x: 181, y: 200 },
  },
  {
    id: "three-plus",
    short: "3-комнатная",
    name: "3-комнатная с гардеробной",
    rooms: 3,
    from: 82,
    to: 200,
    note: "Спальня с гардеробной, два санузла, кухня-гостиная во всю ширину",
    layout: [
      { label: "Кухня-гостиная", x: 20, y: 20, w: 172, h: 112 },
      { label: "Спальня", x: 192, y: 20, w: 108, h: 112 },
      { label: "Детская", x: 20, y: 132, w: 112, h: 68 },
      { label: "Гардероб", x: 132, y: 132, w: 60, h: 68 },
      { label: "Санузел", x: 192, y: 132, w: 56, h: 68, wet: true },
      { label: "Прихожая", x: 248, y: 132, w: 52, h: 68 },
    ],
    balconies: [{ x: 20, y: 200, w: 172, h: 18 }],
    entry: { x: 274, y: 200 },
  },
  {
    id: "four",
    short: "4-комнатная",
    name: "4-комнатная",
    rooms: 4,
    from: 0,
    to: 999,
    note: "Кухня-гостиная, спальня, кабинет и две детские, два санузла",
    layout: [
      { label: "Кухня-гостиная", x: 20, y: 20, w: 150, h: 110 },
      { label: "Спальня", x: 170, y: 20, w: 130, h: 58 },
      { label: "Кабинет", x: 170, y: 78, w: 130, h: 52 },
      { label: "Детская", x: 20, y: 130, w: 112, h: 70 },
      { label: "Детская", x: 132, y: 130, w: 88, h: 70 },
      { label: "Санузел", x: 220, y: 130, w: 80, h: 36, wet: true },
      { label: "С/у гостевой", x: 220, y: 166, w: 80, h: 34, wet: true },
    ],
    balconies: [
      { x: 20, y: 200, w: 150, h: 18 },
      { x: 170, y: 200, w: 130, h: 18 },
    ],
    entry: { x: 260, y: 200 },
  },
];

/** Как называется квартира этого типа: студия отличается от однокомнатной. */
export function flatTypeName(rooms: number, area: number): string {
  return planFor(rooms, area).short;
}

/** Планировка под комнатность и метраж; если точной нет — ближайшая по комнатам. */
export function planFor(rooms: number, area: number): Plan {
  const byRooms = plans.filter((plan) => plan.rooms === rooms);
  const exact = byRooms.find((plan) => area >= plan.from && area < plan.to);
  return exact ?? byRooms[0] ?? plans[0];
}

/** Площадь комнаты — доля её прямоугольника от всей квартиры. */
export function roomAreas(plan: Plan, total: number): number[] {
  const boxes = plan.layout.map((room) => room.w * room.h);
  const sum = boxes.reduce((a, b) => a + b, 0);
  return boxes.map((box) => (box / sum) * total);
}
