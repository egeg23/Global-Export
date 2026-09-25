/**
 * ВНЖ, ПМЖ и гражданство за инвестиции.
 *
 * Пороги и списки стран — их, из блока «Гражданство и ВНЖ» на главной:
 * ВНЖ в ЕС за инвестиции от €250 тыс. в недвижимость и другие активы,
 * отдельные основания для финансово независимых, цифровых кочевников и
 * основателей стартапов; ВНЖ в ОАЭ за инвестиции в недвижимость от
 * $205 тыс.; гражданство за инвестиции — Турция, Египет, Вануату и
 * страны Карибского бассейна.
 *
 * Сроки оформления на их главной не названы. Здесь они подписаны как
 * типовые по программам и участвуют только в сортировке подбора — цифры
 * заказчику показывают с этой оговоркой.
 */

export type Goal = "move" | "mobility" | "business" | "family";

export const goals: { id: Goal; label: string; note: string }[] = [
  { id: "move", label: "Переехать жить", note: "Нужен статус резидента и жильё" },
  { id: "mobility", label: "Свобода поездок", note: "Паспорт или статус ради границ" },
  { id: "business", label: "Вести дело", note: "Компания, счета, налоговый статус" },
  { id: "family", label: "Для семьи", note: "Статус сразу на супруга и детей" },
];

export type Permit = {
  id: string;
  label: string;
  /** Что именно даёт программа. */
  kind: "ВНЖ" | "ПМЖ" | "Гражданство";
  /** Порог входа: строка, потому что валюты разные — их же. */
  from: string;
  /** Порог в тысячах евро для сравнения и фильтра. */
  fromEur: number;
  /** Типовой срок оформления, месяцев. */
  months: number;
  goals: Goal[];
  /** Флаги стран программы. */
  flags: string[];
  note: string;
};

export const permits: Permit[] = [
  {
    id: "eu-invest",
    label: "ВНЖ в ЕС за инвестиции",
    kind: "ВНЖ",
    from: "от €250 тыс.",
    fromEur: 250,
    months: 8,
    goals: ["move", "family", "business"],
    flags: ["gr", "pt", "es"],
    note: "Вложение в недвижимость или другие активы",
  },
  {
    id: "greece-golden",
    label: "Золотая виза Греции",
    kind: "ВНЖ",
    from: "от €250 тыс.",
    fromEur: 250,
    months: 6,
    goals: ["move", "mobility", "family"],
    flags: ["gr"],
    note: "Право жить в Греции и въезд в Шенген",
  },
  {
    id: "cyprus-pr",
    label: "ПМЖ Кипра при покупке",
    kind: "ПМЖ",
    from: "от €300 тыс.",
    fromEur: 300,
    months: 4,
    goals: ["move", "family", "business"],
    flags: ["cy"],
    note: "Наш проект в Лимасоле от €232 тыс. подходит под ПМЖ",
  },
  {
    id: "uae-golden",
    label: "ВНЖ в ОАЭ за недвижимость",
    kind: "ВНЖ",
    from: "от $205 тыс.",
    fromEur: 190,
    months: 2,
    goals: ["business", "mobility", "family"],
    flags: ["ae"],
    note: "Золотая виза ОАЭ — на десять лет, с семьёй",
  },
  {
    id: "eu-independent",
    label: "ВНЖ для финансово независимых",
    kind: "ВНЖ",
    from: "подтверждение дохода",
    fromEur: 60,
    months: 5,
    goals: ["move", "family"],
    flags: ["pt", "es", "gr"],
    note: "Без покупки: основание — пассивный доход",
  },
  {
    id: "eu-nomad",
    label: "ВНЖ цифрового кочевника",
    kind: "ВНЖ",
    from: "подтверждение дохода",
    fromEur: 40,
    months: 3,
    goals: ["move", "business"],
    flags: ["pt", "hr", "es"],
    note: "Основание — удалённый доход, без покупки жилья",
  },
  {
    id: "eu-startup",
    label: "ВНЖ основателя стартапа",
    kind: "ВНЖ",
    from: "бизнес-план",
    fromEur: 50,
    months: 6,
    goals: ["business", "move"],
    flags: ["pt", "es", "fr"],
    note: "Основание — бизнес-план и вложение в компанию",
  },
  {
    id: "turkey-citizen",
    label: "Гражданство Турции",
    kind: "Гражданство",
    from: "от $400 тыс.",
    fromEur: 370,
    months: 7,
    goals: ["mobility", "family"],
    flags: ["tr"],
    note: "Гражданство за инвестиции, паспорт на всю семью",
  },
  {
    id: "caribbean",
    label: "Гражданство Карибов",
    kind: "Гражданство",
    from: "от $230 тыс.",
    fromEur: 215,
    months: 6,
    goals: ["mobility", "family"],
    flags: [],
    note: "Программы стран Карибского бассейна",
  },
  {
    id: "vanuatu",
    label: "Гражданство Вануату",
    kind: "Гражданство",
    from: "от $130 тыс.",
    fromEur: 120,
    months: 2,
    goals: ["mobility"],
    flags: [],
    note: "Самая быстрая из программ гражданства",
  },
];

export function fit(goal: Goal | null, budget: number): Permit[] {
  return permits
    .filter((permit) => (goal ? permit.goals.includes(goal) : true))
    .filter((permit) => permit.fromEur <= budget)
    .sort((a, b) => a.months - b.months);
}

/** «8 месяцев», «2 месяца», «1 месяц». */
export function months(count: number): string {
  const last = count % 10;
  const teen = count % 100 >= 11 && count % 100 <= 14;
  if (!teen && last === 1) return `${count} месяц`;
  if (!teen && last >= 2 && last <= 4) return `${count} месяца`;
  return `${count} месяцев`;
}
