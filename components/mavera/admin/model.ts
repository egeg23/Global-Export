/**
 * Данные панели: проекты, корпуса, квартиры, заявки, медиатека, сотрудники.
 *
 * Панель — не набор отдельных экранов, а один прототип: квартиру меняют в
 * шахматке, остаток пересчитывается в обзоре, а строка о правке появляется в
 * журнале действий и оттуда откатывается. Поэтому всё живёт в одной модели.
 *
 * Россыпь детерминированная: одна и та же шахматка при каждой сборке и у
 * каждого, кто откроет ссылку. Случайность здесь была бы вредна — заказчик
 * возвращается на экран и ждёт увидеть то же, что минуту назад.
 */

/* ------------------------------------------------------------------ */
/* Разделы панели                                                      */
/* ------------------------------------------------------------------ */

export type AdminScreenId =
  | "overview"
  | "projects"
  | "project-form"
  | "flats"
  | "leads"
  | "users"
  | "analytics"
  | "media"
  | "audit";

/** Панель на весь экран для этого пакета: отдельная страница, без рамки презентации. */
export const panelHref = (tier: string) => `/mavera/${tier}/panel`;

export const adminSections: { id: AdminScreenId; label: string; group: string }[] = [
  { id: "overview", label: "Обзор", group: "Работа" },
  { id: "projects", label: "Жилые комплексы", group: "Каталог" },
  { id: "project-form", label: "Карточка ЖК", group: "Каталог" },
  { id: "flats", label: "Корпуса и квартиры", group: "Каталог" },
  { id: "media", label: "Медиатека", group: "Каталог" },
  { id: "leads", label: "Заявки", group: "Продажи" },
  { id: "analytics", label: "Аналитика", group: "Продажи" },
  { id: "users", label: "Пользователи и роли", group: "Настройки" },
  { id: "audit", label: "Журнал действий", group: "Настройки" },
];

export type Lang = "RU" | "EN" | "UZ";
export const langs: Lang[] = ["RU", "EN", "UZ"];

/* ------------------------------------------------------------------ */
/* Квартиры                                                            */
/* ------------------------------------------------------------------ */

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

export const corpusStates: Corpus["state"][] = ["Сдан", "Продаётся", "Строится"];

export type Flat = {
  id: string;
  project: string;
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

export const plans = [
  "1-комн. 38,4 м²",
  "2-комн. 56,2 м²",
  "3-комн. 78,5 м²",
  "4-комн. 104,6 м²",
];

export const views = ["Во двор", "На улицу", "На парк"];

/* ------------------------------------------------------------------ */
/* Проекты                                                             */
/* ------------------------------------------------------------------ */

export type Project = {
  id: string;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
  district: string;
  segment: "Эконом" | "Комфорт" | "Бизнес";
  published: boolean;
  /** Порядок на сайте: меньше — выше. */
  order: number;
  corpuses: Corpus[];
};

export const segments: Project["segment"][] = ["Эконом", "Комфорт", "Бизнес"];

const corpusSet = (...rows: [number, number, string, Corpus["state"]][]): Corpus[] =>
  rows.map(([floors, perFloor, due, state], index) => ({
    id: index + 1,
    floors,
    perFloor,
    due,
    state,
  }));

export const initialProjects: Project[] = [
  {
    id: "chinor",
    name: { RU: "ЖК «Чинор»", EN: "Chinor Residence", UZ: "" },
    desc: {
      RU: "Квартал в Мирзо-Улугбекском районе: пять корпусов, закрытый двор и школа на территории.",
      EN: "",
      UZ: "",
    },
    district: "Мирзо-Улугбекский",
    segment: "Комфорт",
    published: true,
    order: 1,
    corpuses: corpusSet(
      [9, 12, "Сдан в 2024", "Сдан"],
      [12, 12, "Сдан в 2025", "Сдан"],
      [16, 12, "IV кв. 2026", "Продаётся"],
      [16, 12, "IV кв. 2026", "Продаётся"],
      [10, 12, "II кв. 2027", "Строится"],
    ),
  },
  {
    id: "daryo",
    name: { RU: "ЖК «Дарё»", EN: "Daryo Residence", UZ: "Daryo turar-joy majmuasi" },
    desc: {
      RU: "Бизнес-класс у канала: три корпуса, подземный паркинг, набережная под окнами.",
      EN: "Business class by the canal: three buildings and an embankment.",
      UZ: "",
    },
    district: "Яшнабадский",
    segment: "Бизнес",
    published: true,
    order: 2,
    corpuses: corpusSet(
      [12, 12, "Сдан в 2025", "Сдан"],
      [16, 12, "III кв. 2026", "Продаётся"],
      [10, 12, "I кв. 2028", "Строится"],
    ),
  },
  {
    id: "bahor",
    name: { RU: "ЖК «Бахор»", EN: "", UZ: "" },
    desc: { RU: "Эконом-класс в Сергелийском районе, оба корпуса сданы.", EN: "", UZ: "" },
    district: "Сергелийский",
    segment: "Эконом",
    published: true,
    order: 3,
    corpuses: corpusSet([9, 12, "Сдан в 2023", "Сдан"], [9, 12, "Сдан в 2024", "Сдан"]),
  },
  {
    id: "oltin-vodiy",
    name: { RU: "ЖК «Олтин Водий»", EN: "", UZ: "" },
    desc: { RU: "", EN: "", UZ: "" },
    district: "Юнусабадский",
    segment: "Комфорт",
    published: false,
    order: 4,
    corpuses: corpusSet([14, 12, "II кв. 2027", "Строится"], [14, 12, "IV кв. 2027", "Строится"]),
  },
];

/** Комнатность по месту на этаже: одинаковая планировка этажей, как в жизни. */
const roomsBySlot = [1, 2, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2];
const areaByRooms: Record<number, number> = { 1: 38.4, 2: 56.2, 3: 78.5, 4: 104.6 };

/** Простой разброс без случайности: три множителя и остаток. */
function scatter(seed: number, floor: number, slot: number): number {
  return (seed * 137 + floor * 47 + slot * 23) % 100;
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

function priceOf(seed: number, corpus: number, floor: number, rooms: number): number {
  // Этаж дороже, мелкая квартира дороже в пересчёте на метр — как в прайсах.
  const perRoom = rooms === 1 ? 700_000 : rooms === 2 ? 300_000 : rooms === 3 ? 0 : -200_000;
  const raw = 9_800_000 + seed * 240_000 + corpus * 110_000 + (floor - 1) * 42_000 + perRoom;
  return Math.round(raw / 1000) * 1000;
}

export function buildFlats(projects: Project[] = initialProjects): Flat[] {
  const flats: Flat[] = [];

  projects.forEach((project, index) => {
    const seed = index + 1;
    for (const corpus of project.corpuses) {
      for (let floor = 1; floor <= corpus.floors; floor++) {
        for (let slot = 1; slot <= corpus.perFloor; slot++) {
          const spread = scatter(seed * 3 + corpus.id, floor, slot);
          const rooms = roomsBySlot[(slot - 1) % roomsBySlot.length];
          flats.push({
            id: `${project.id}-${corpus.id}-${floor}-${slot}`,
            project: project.id,
            corpus: corpus.id,
            floor,
            slot,
            no: (floor - 1) * corpus.perFloor + slot,
            rooms,
            area: areaByRooms[rooms],
            priceM2: priceOf(seed, corpus.id, floor, rooms),
            status: statusOf(corpus, floor, spread),
            view: views[spread % views.length],
            plan: plans[rooms - 1],
          });
        }
      }
    }
  });

  return flats;
}

export function countByStatus(flats: Flat[]): Record<FlatStatus, number> {
  const counts: Record<FlatStatus, number> = { free: 0, booked: 0, sold: 0 };
  for (const flat of flats) counts[flat.status] += 1;
  return counts;
}

/* ------------------------------------------------------------------ */
/* Заявки                                                              */
/* ------------------------------------------------------------------ */

export type LeadState = "Новая" | "В работе" | "Обработана" | "Сделка";

export const leadStates: LeadState[] = ["Новая", "В работе", "Обработана", "Сделка"];

export type Lead = {
  id: string;
  date: string;
  name: string;
  contact: string;
  source: string;
  project: string;
  owner: string;
  state: LeadState;
  /** Ушла ли заявка в CRM. Меняется, когда меняют статус. */
  synced: boolean;
};

export const initialLeads: Lead[] = [
  { id: "l1", date: "15.09, 14:32", name: "Азиз Р.", contact: "+998 90 123-45-67", source: "Карточка ЖК · 3-комн.", project: "chinor", owner: "Нодира", state: "Новая", synced: true },
  { id: "l2", date: "15.09, 11:04", name: "Дилноза К.", contact: "@dilnoza", source: "Главная · обратный звонок", project: "chinor", owner: "Нодира", state: "В работе", synced: true },
  { id: "l3", date: "14.09, 18:20", name: "Сергей М.", contact: "+998 93 555-11-02", source: "Коммерция · аренда", project: "daryo", owner: "Бекзод", state: "В работе", synced: false },
  { id: "l4", date: "14.09, 09:47", name: "Нилуфар А.", contact: "nilufar@mail.uz", source: "Калькулятор ипотеки", project: "daryo", owner: "Бекзод", state: "Обработана", synced: true },
  { id: "l5", date: "13.09, 16:12", name: "Тимур Х.", contact: "+998 91 700-80-90", source: "Бронь квартиры", project: "chinor", owner: "Нодира", state: "Сделка", synced: true },
  { id: "l6", date: "13.09, 10:05", name: "Мадина Ю.", contact: "@madina_y", source: "Карточка ЖК · 1-комн.", project: "bahor", owner: "Азиз", state: "Новая", synced: true },
  { id: "l7", date: "12.09, 19:41", name: "Рустам Б.", contact: "+998 97 302-14-55", source: "Генплан · корпус 2", project: "daryo", owner: "Бекзод", state: "Обработана", synced: true },
  { id: "l8", date: "12.09, 12:18", name: "Гульнора С.", contact: "gulnora.s@gmail.com", source: "Главная · форма", project: "chinor", owner: "Азиз", state: "Сделка", synced: true },
];

/* ------------------------------------------------------------------ */
/* Сотрудники и права                                                  */
/* ------------------------------------------------------------------ */

export type Role = "Администратор" | "Контент-менеджер" | "Менеджер продаж" | "Наблюдатель";

export const roles: Role[] = ["Администратор", "Контент-менеджер", "Менеджер продаж", "Наблюдатель"];

export type Staff = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
};

export const initialStaff: Staff[] = [
  { id: "s1", name: "Азиз Каримов", email: "aziz@mavera.uz", role: "Администратор", active: true },
  { id: "s2", name: "Нодира Юсупова", email: "nodira@mavera.uz", role: "Менеджер продаж", active: true },
  { id: "s3", name: "Бекзод Раимов", email: "bekzod@mavera.uz", role: "Менеджер продаж", active: true },
  { id: "s4", name: "Шахноза Т.", email: "shahnoza@mavera.uz", role: "Контент-менеджер", active: true },
  { id: "s5", name: "Улугбек Н.", email: "ulugbek@mavera.uz", role: "Наблюдатель", active: false },
];

/** Права по разделам: что роль может делать. */
export const rightRows = [
  "Править страницы и тексты",
  "Менять цены и статусы квартир",
  "Видеть заявки",
  "Выгружать в CRM",
  "Заводить сотрудников",
] as const;

export type Right = (typeof rightRows)[number];

export type Rights = Record<Role, Record<Right, boolean>>;

export const initialRights: Rights = {
  Администратор: {
    "Править страницы и тексты": true,
    "Менять цены и статусы квартир": true,
    "Видеть заявки": true,
    "Выгружать в CRM": true,
    "Заводить сотрудников": true,
  },
  "Контент-менеджер": {
    "Править страницы и тексты": true,
    "Менять цены и статусы квартир": false,
    "Видеть заявки": false,
    "Выгружать в CRM": false,
    "Заводить сотрудников": false,
  },
  "Менеджер продаж": {
    "Править страницы и тексты": false,
    "Менять цены и статусы квартир": true,
    "Видеть заявки": true,
    "Выгружать в CRM": true,
    "Заводить сотрудников": false,
  },
  Наблюдатель: {
    "Править страницы и тексты": false,
    "Менять цены и статусы квартир": false,
    "Видеть заявки": true,
    "Выгружать в CRM": false,
    "Заводить сотрудников": false,
  },
};

/* ------------------------------------------------------------------ */
/* Медиатека                                                           */
/* ------------------------------------------------------------------ */

export type MediaKind = "Фото" | "Рендер" | "Планировка" | "Документ";

export const mediaKinds: MediaKind[] = ["Фото", "Рендер", "Планировка", "Документ"];

export type MediaFile = {
  id: string;
  name: string;
  kind: MediaKind;
  size: string;
  /** В скольких карточках используется — удалять занятый файл панель не даёт. */
  used: number;
};

export const initialMedia: MediaFile[] = [
  { id: "m1", name: "chinor-fasad-1.jpg", kind: "Фото", size: "2,4 МБ", used: 3 },
  { id: "m2", name: "chinor-dvor.jpg", kind: "Фото", size: "1,9 МБ", used: 2 },
  { id: "m3", name: "chinor-render-night.webp", kind: "Рендер", size: "3,1 МБ", used: 1 },
  { id: "m4", name: "daryo-naberezhnaya.jpg", kind: "Фото", size: "2,2 МБ", used: 1 },
  { id: "m5", name: "plan-3k-78.pdf", kind: "Планировка", size: "480 КБ", used: 4 },
  { id: "m6", name: "plan-2k-56.pdf", kind: "Планировка", size: "410 КБ", used: 4 },
  { id: "m7", name: "genplan-chinor.pdf", kind: "Документ", size: "1,2 МБ", used: 1 },
  { id: "m8", name: "bahor-sdan.jpg", kind: "Фото", size: "1,7 МБ", used: 0 },
];

/* ------------------------------------------------------------------ */
/* Журнал действий                                                     */
/* ------------------------------------------------------------------ */

/** Что нужно, чтобы отменить правку. Журнал умеет откатывать только это. */
export type Undo =
  | { kind: "flats"; before: Record<string, Partial<Flat>> }
  | { kind: "lead"; id: string; before: Partial<Lead> }
  | { kind: "project"; id: string; before: Partial<Project> };

export type AuditEntry = {
  id: string;
  at: string;
  who: string;
  section: string;
  what: string;
  target: string;
  undo?: Undo;
  /** Откат уже применяли — второй раз кнопки нет. */
  reverted?: boolean;
};

export const initialAudit: AuditEntry[] = [
  { id: "a1", at: "15.09, 12:40", who: "Нодира Юсупова", section: "Заявки", what: "Статус: Новая → В работе", target: "Дилноза К." },
  { id: "a2", at: "15.09, 10:12", who: "Азиз Каримов", section: "Квартиры", what: "Цена: 11 250 000 → 11 480 000 сум", target: "ЖК «Чинор», корпус 3, 24 квартиры" },
  { id: "a3", at: "14.09, 17:55", who: "Шахноза Т.", section: "Карточка ЖК", what: "Описание RU изменено", target: "ЖК «Дарё»" },
  { id: "a4", at: "14.09, 09:30", who: "Азиз Каримов", section: "Пользователи", what: "Роль: Наблюдатель → Менеджер продаж", target: "Бекзод Раимов" },
  { id: "a5", at: "13.09, 15:02", who: "Шахноза Т.", section: "Медиатека", what: "Загружено файлов: 6", target: "ЖК «Чинор»" },
];

/* ------------------------------------------------------------------ */
/* Форматирование                                                      */
/* ------------------------------------------------------------------ */

/**
 * Склонение числительного: «1 проект», «2 проекта», «5 проектов».
 *
 * Мелочь, но панель показывает счётчики почти на каждом экране, и «5 проекта»
 * в углу окна заметно сильнее, чем кажется при написании кода.
 */
export function plural(count: number, forms: [string, string, string]): string {
  const tens = Math.abs(count) % 100;
  const ones = tens % 10;
  if (tens > 10 && tens < 20) return `${count} ${forms[2]}`;
  if (ones > 1 && ones < 5) return `${count} ${forms[1]}`;
  if (ones === 1) return `${count} ${forms[0]}`;
  return `${count} ${forms[2]}`;
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
