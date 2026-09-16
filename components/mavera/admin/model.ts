/**
 * Данные, на которых работают живые экраны панели.
 *
 * Шахматка, корпуса и заявки собираются здесь, а не пишутся в разметке:
 * экран должен считать остаток квартир и суммы сам, иначе первое же
 * изменение статуса разойдётся с цифрами в шапке.
 *
 * Россыпь детерминированная: одна и та же шахматка при каждой сборке и у
 * каждого, кто откроет ссылку. Случайность здесь была бы вредна — заказчик
 * возвращается на экран и ждёт увидеть то же, что минуту назад.
 */

export type FlatStatus = "free" | "booked" | "sold";

export const statusLabel: Record<FlatStatus, string> = {
  free: "Свободна",
  booked: "Бронь",
  sold: "Продана",
};

export const statusTone: Record<FlatStatus, string> = {
  free: "bg-forest-600",
  booked: "bg-harvest-400",
  sold: "bg-forest-900/12",
};

export type Corpus = {
  id: number;
  floors: number;
  perFloor: number;
  due: string;
  state: "Сдан" | "Продаётся" | "Строится";
};

/** Корпуса ЖК «Чинор». Отсюда же строится таблица в карточке ЖК. */
export const corpuses: Corpus[] = [
  { id: 1, floors: 9, perFloor: 12, due: "Сдан в 2024", state: "Сдан" },
  { id: 2, floors: 12, perFloor: 12, due: "Сдан в 2025", state: "Сдан" },
  { id: 3, floors: 16, perFloor: 12, due: "IV кв. 2026", state: "Продаётся" },
  { id: 4, floors: 16, perFloor: 12, due: "IV кв. 2026", state: "Продаётся" },
  { id: 5, floors: 10, perFloor: 12, due: "II кв. 2027", state: "Строится" },
];

export const plans = [
  "1-комн. 38,4 м²",
  "2-комн. 56,2 м²",
  "3-комн. 78,5 м²",
  "4-комн. 104,6 м²",
];

export const views = ["Во двор", "На улицу", "На парк"];

export type Flat = {
  id: string;
  corpus: number;
  floor: number;
  /** Место на этаже, от 1. */
  slot: number;
  /** Номер квартиры в корпусе — то, чем её называет отдел продаж. */
  no: number;
  rooms: number;
  area: number;
  priceM2: number;
  status: FlatStatus;
  view: string;
  plan: string;
};

/** Комнатность по месту на этаже: одинаковая планировка этажей, как в жизни. */
const roomsBySlot = [1, 2, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2];
const areaByRooms: Record<number, number> = { 1: 38.4, 2: 56.2, 3: 78.5, 4: 104.6 };

/** Простой разброс без случайности: три множителя и остаток. */
function scatter(corpus: number, floor: number, slot: number): number {
  return (corpus * 137 + floor * 47 + slot * 23) % 100;
}

function statusOf(corpus: Corpus, floor: number, spread: number): FlatStatus {
  // Сданные корпуса почти распроданы, строящийся только вышел в продажу,
  // и в любом корпусе нижние этажи уходят раньше верхних.
  const base = corpus.state === "Сдан" ? 92 : corpus.state === "Строится" ? 26 : 64;
  const sold = Math.max(6, base - (floor - 1) * 3);
  const booked = sold + 14;
  if (spread < sold) return "sold";
  if (spread < booked) return "booked";
  return "free";
}

function priceOf(corpus: number, floor: number, rooms: number): number {
  // Этаж дороже, мелкая квартира дороже в пересчёте на метр — как в прайсах.
  const perRoom = rooms === 1 ? 700_000 : rooms === 2 ? 300_000 : rooms === 3 ? 0 : -200_000;
  const raw = 10_300_000 + corpus * 110_000 + (floor - 1) * 42_000 + perRoom;
  return Math.round(raw / 1000) * 1000;
}

export function buildFlats(): Flat[] {
  const flats: Flat[] = [];

  for (const corpus of corpuses) {
    for (let floor = 1; floor <= corpus.floors; floor++) {
      for (let slot = 1; slot <= corpus.perFloor; slot++) {
        const spread = scatter(corpus.id, floor, slot);
        const rooms = roomsBySlot[(slot - 1) % roomsBySlot.length];
        flats.push({
          id: `k${corpus.id}-${floor}-${slot}`,
          corpus: corpus.id,
          floor,
          slot,
          no: (floor - 1) * corpus.perFloor + slot,
          rooms,
          area: areaByRooms[rooms],
          priceM2: priceOf(corpus.id, floor, rooms),
          status: statusOf(corpus, floor, spread),
          view: views[spread % views.length],
          plan: plans[rooms - 1],
        });
      }
    }
  }

  return flats;
}

export function countByStatus(flats: Flat[]): Record<FlatStatus, number> {
  const counts: Record<FlatStatus, number> = { free: 0, booked: 0, sold: 0 };
  for (const flat of flats) counts[flat.status] += 1;
  return counts;
}

/** Разряды неразрывными пробелами: сервер и клиент обязаны совпасть. */
export function fmt(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function area(value: number): string {
  return value.toString().replace(".", ",");
}

/* ------------------------------------------------------------------ */
/* Заявки                                                              */
/* ------------------------------------------------------------------ */

export type LeadState = "Новая" | "В работе" | "Обработана" | "Сделка";

export const leadStates: LeadState[] = ["Новая", "В работе", "Обработана", "Сделка"];

export const managers = ["Нодира", "Бекзод", "Азиз"];

export type Lead = {
  id: string;
  date: string;
  name: string;
  source: string;
  owner: string;
  state: LeadState;
  /** Ушла ли заявка в CRM. Меняется, когда меняют статус. */
  synced: boolean;
};

export const initialLeads: Lead[] = [
  { id: "l1", date: "15.09, 14:32", name: "Азиз Р.", source: "ЖК «Чинор» · 3-комн.", owner: "Нодира", state: "Новая", synced: true },
  { id: "l2", date: "15.09, 11:04", name: "Дилноза К.", source: "Главная · обратный звонок", owner: "Нодира", state: "В работе", synced: true },
  { id: "l3", date: "14.09, 18:20", name: "Сергей М.", source: "Коммерция · аренда", owner: "Бекзод", state: "В работе", synced: false },
  { id: "l4", date: "14.09, 09:47", name: "Нилуфар А.", source: "ЖК «Дарё» · калькулятор", owner: "Бекзод", state: "Обработана", synced: true },
  { id: "l5", date: "13.09, 16:12", name: "Тимур Х.", source: "ЖК «Чинор» · бронь", owner: "Нодира", state: "Сделка", synced: true },
  { id: "l6", date: "13.09, 10:05", name: "Мадина Ю.", source: "ЖК «Чинор» · 1-комн.", owner: "Азиз", state: "Новая", synced: true },
  { id: "l7", date: "12.09, 19:41", name: "Рустам Б.", source: "Генплан · корпус 4", owner: "Бекзод", state: "Обработана", synced: true },
];

/* ------------------------------------------------------------------ */
/* Транслитерация адреса                                               */
/* ------------------------------------------------------------------ */

const translit: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/**
 * Адрес страницы из названия.
 *
 * Кавычки, скобки и слово «ЖК» выкидываются: в адресе они только мешают, а
 * заказчик всё равно пишет название так, как оно стоит на баннере.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/жк/g, " ")
    .replace(/[«»"'()]/g, " ")
    .split("")
    .map((char) => (char in translit ? translit[char] : char))
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
