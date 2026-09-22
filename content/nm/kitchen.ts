/**
 * Конфигуратор кухни: из чего складывается цена.
 *
 * На namuna.uz есть квиз «Какой тип мебели вам нужен?», но он ничего не
 * считает — просто собирает ответы и отправляет заявку. Здесь он доведён
 * до того, ради чего его и открывают: человек видит вилку цены и срок
 * сразу, а заявка уходит уже с составом.
 *
 * Про цифры честно. Прайса у них на сайте нет, поэтому `price` — не их
 * прайс, а ориентир по рынку Ташкента за погонный метр, разложенный по
 * тем же материалам и фурнитуре, которые они сами называют своими
 * партнёрами. На странице это подписано, а в рабочем сайте таблица
 * приходит из панели управления. Вилка ±12% — потому что честная цена
 * кухни на заказ до замера и не бывает точкой.
 *
 * Все суммы — в миллионах сумов, как считают на этом рынке.
 */

export type Option = {
  id: string;
  label: string;
  /** Одна строка о том, что это и почему столько стоит. */
  note: string;
  /** Прибавка к цене погонного метра, млн сум. */
  perMetre: number;
  /** На сколько дней удлиняет изготовление. */
  days: number;
  /** Образец материала из их же съёмки, если он есть. */
  swatch?: string;
};

export type Group = {
  id: "layout" | "front" | "top" | "hardware" | "light";
  label: string;
  /** Что именно выбирают — подсказка под заголовком группы. */
  hint: string;
  options: Option[];
};

/** Планировки. `metres` — типовая длина фронта, из неё считается цена. */
export const layouts: (Option & { metres: number; plan: string })[] = [
  {
    id: "line",
    label: "Прямая",
    note: "Один фронт вдоль стены — для кухни-ниши и студии",
    perMetre: 0,
    days: 0,
    metres: 3.2,
    plan: "M4 20 H60 V40 H4 Z",
  },
  {
    id: "corner",
    label: "Угловая",
    note: "Г-образная: рабочий треугольник без лишних шагов",
    perMetre: 0,
    days: 2,
    metres: 4.6,
    plan: "M4 8 H24 V40 H60 V56 H4 Z",
  },
  {
    id: "u",
    label: "П-образная",
    note: "Три фронта: максимум хранения и рабочей поверхности",
    perMetre: 0,
    days: 4,
    metres: 6.2,
    plan: "M4 8 H20 V44 H44 V8 H60 V56 H4 Z",
  },
  {
    id: "island",
    label: "С островом",
    note: "Фронт плюс отдельный остров с варочной или мойкой",
    perMetre: 0.4,
    days: 6,
    metres: 5.4,
    plan: "M4 6 H60 V20 H4 Z M18 36 H46 V52 H18 Z",
  },
];

export const groups: Group[] = [
  {
    id: "front",
    label: "Фасады",
    hint: "Главная строка сметы: от неё зависит и вид, и цена",
    options: [
      {
        id: "film",
        label: "ЛДСП в плёнке",
        note: "Плита Egger или Kronospan — рабочее решение с честным сроком службы",
        perMetre: 4.2,
        days: 0,
        swatch: "matt-grey",
      },
      {
        id: "matt",
        label: "Крашеный МДФ, мат",
        note: "Эмаль Sirca: ровный матовый тон, не бликует и не собирает отпечатки",
        perMetre: 6.4,
        days: 5,
        swatch: "lacquer-white",
      },
      {
        id: "milled",
        label: "Фрезерованный МДФ",
        note: "Классический фасад с фрезеровкой под покраску",
        perMetre: 7.8,
        days: 8,
        swatch: "milled-white",
      },
      {
        id: "veneer",
        label: "Шпон дуба",
        note: "Натуральный шпон: у каждой дверцы свой рисунок, повторить нельзя",
        perMetre: 9.6,
        days: 10,
        swatch: "veneer-oak",
      },
      {
        id: "graphite",
        label: "Графит, глянец",
        note: "Тёмная эмаль в глянце — эффектно, но показывает каждый отпечаток",
        perMetre: 7.1,
        days: 6,
        swatch: "lacquer-graphite",
      },
    ],
  },
  {
    id: "top",
    label: "Столешница",
    hint: "То, что режут, льют и ставят горячим",
    options: [
      {
        id: "post",
        label: "ЛДСП, постформинг",
        note: "Разумный минимум: боится долгой воды на стыках",
        perMetre: 0.9,
        days: 0,
      },
      {
        id: "quartz",
        label: "Кварцевый агломерат",
        note: "Не боится ножа и кипятка, шов почти не виден",
        perMetre: 3.4,
        days: 7,
        swatch: "stone-marble",
      },
      {
        id: "stone",
        label: "Натуральный камень",
        note: "Мрамор или гранит: рисунок неповторим, требует ухода",
        perMetre: 4.8,
        days: 10,
        swatch: "stone-dark",
      },
    ],
  },
  {
    id: "hardware",
    label: "Фурнитура",
    hint: "Её не видно на фото, но именно ею кухня пользуется каждый день",
    options: [
      {
        id: "base",
        label: "Петли с доводчиком",
        note: "Базовый набор: дверцы закрываются мягко",
        perMetre: 0,
        days: 0,
      },
      {
        id: "blum",
        label: "Blum TANDEMBOX",
        note: "Ящики с полным выдвижением и доводкой — то, что чувствуется рукой",
        perMetre: 1.6,
        days: 2,
      },
      {
        id: "full",
        label: "Blum AVENTOS + Vauth-Sagel",
        note: "Подъёмники на верхние фасады и выкатные карго в углы",
        perMetre: 3.1,
        days: 4,
      },
    ],
  },
  {
    id: "light",
    label: "Подсветка",
    hint: "Свет под верхними ящиками и внутри витрин",
    options: [
      { id: "none", label: "Без подсветки", note: "Оставляем на потом", perMetre: 0, days: 0 },
      {
        id: "domus",
        label: "Domus Line",
        note: "Светодиодная лента рабочей зоны с датчиком движения",
        perMetre: 0.6,
        days: 1,
      },
    ],
  },
];

export type Choice = Record<Group["id"], string>;

export const defaultChoice: Choice = {
  layout: "corner",
  front: "matt",
  top: "quartz",
  hardware: "blum",
  light: "domus",
};

const groupById = new Map(groups.map((group) => [group.id, group]));

export function optionOf(groupId: Group["id"], optionId: string): Option {
  if (groupId === "layout") return layouts.find((l) => l.id === optionId) ?? layouts[0];
  const group = groupById.get(groupId);
  return group?.options.find((o) => o.id === optionId) ?? group!.options[0];
}

export function layoutOf(choice: Choice) {
  return layouts.find((l) => l.id === choice.layout) ?? layouts[0];
}

export type Estimate = {
  metres: number;
  /** Цена погонного метра, млн сум. */
  perMetre: number;
  low: number;
  high: number;
  /** Рабочих дней от заявки до установки. */
  days: number;
  /** Строки сметы для формы заявки. */
  lines: { group: string; label: string; perMetre: number }[];
};

/** Базовые 15 дней изготовления — нижняя граница их собственного срока. */
const BASE_DAYS = 15;

export function estimate(choice: Choice): Estimate {
  const layout = layoutOf(choice);
  const picks = groups.map((group) => ({
    group,
    option: optionOf(group.id, choice[group.id]),
  }));

  const perMetre =
    layout.perMetre + picks.reduce((sum, { option }) => sum + option.perMetre, 0);
  const total = perMetre * layout.metres;
  const days =
    BASE_DAYS + layout.days + picks.reduce((sum, { option }) => sum + option.days, 0);

  return {
    metres: layout.metres,
    perMetre,
    // Вилка, а не точка: точную цену называют после замера.
    low: total * 0.88,
    high: total * 1.12,
    days,
    lines: [
      { group: "Планировка", label: layout.label, perMetre: layout.perMetre },
      ...picks.map(({ group, option }) => ({
        group: group.label,
        label: option.label,
        perMetre: option.perMetre,
      })),
    ],
  };
}

/** «62,4» — дробь одна, пробелы неразрывные. */
export function sums(value: number): string {
  return value
    .toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    .replace(/\s/g, " ");
}

/** Дата готовности от сегодняшнего дня, словами. */
export function readyBy(days: number, from = new Date()): string {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}
