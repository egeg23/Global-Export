/**
 * Калькулятор мебели: из чего складывается цена.
 *
 * На namuna.uz есть квиз «Какой тип мебели вам нужен?», но он ничего не
 * считает — собирает ответы и отправляет заявку. Здесь он доведён до
 * того, ради чего его открывают: человек выбирает тип мебели, объём и
 * материалы и сразу видит вилку и срок, а заявка уходит уже с составом.
 *
 * Порядок тот же, что в калькуляторе на devuz.studio: сначала «что
 * делаем», потом «настройте под себя», потом предварительная оценка с
 * вилкой, сроком и оговоркой. Разница в том, что здесь считается не
 * проект, а погонные метры мебели.
 *
 * Про цифры честно. Прайса у них на сайте нет, поэтому цены — не их
 * прайс, а ориентир по рынку Ташкента за погонный метр, разложенный по
 * тем же материалам и фурнитуре, которых они сами называют своими
 * партнёрами. На странице это подписано, а в рабочем сайте таблица
 * приходит из панели управления. Вилка ±12% — потому что честная цена
 * мебели на заказ до замера и не бывает точкой.
 *
 * Все суммы — в миллионах сумов, как считают на этом рынке.
 */

export type KindId =
  | "kitchen"
  | "wardrobe"
  | "living"
  | "bedroom"
  | "kids"
  | "hall"
  | "bath"
  | "flat";

export type GroupId = "layout" | "front" | "top" | "fill" | "hardware" | "light";

export type Option = {
  id: string;
  label: string;
  /** Одна строка о том, что это и почему столько стоит. */
  note: string;
  /** Прибавка к цене единицы объёма, млн сум. */
  perUnit: number;
  /** На сколько дней удлиняет изготовление. */
  days: number;
  /** Для каких типов мебели вариант имеет смысл. Пусто — для всех. */
  kinds?: KindId[];
  /** Образец материала из их же съёмки, если он есть. */
  swatch?: string;
};

export type Group = {
  id: GroupId;
  label: string;
  /** Что именно выбирают — подсказка под заголовком группы. */
  hint: string;
  options: Option[];
};

/* ------------------------------------------------------------------ */
/* 01 · Что делаем                                                     */
/* ------------------------------------------------------------------ */

export type Kind = {
  id: KindId;
  label: string;
  note: string;
  /** Чем меряем объём: погонный метр, комплект или комната. */
  unit: "м" | "комплект" | "комната";
  /** Как подписан ползунок объёма. */
  amountLabel: string;
  amount: number;
  min: number;
  max: number;
  step: number;
  /**
   * Сколько погонных метров фронта стоит одна единица объёма.
   *
   * У кухни и шкафа единица и есть погонный метр, поэтому единица. У
   * комплекта и комнаты — пересчёт: спальня это шкаф, изголовье и две
   * тумбы, и меряется она по сумме их фронтов. Коэффициент показан в
   * составе сметы, чтобы цифра не бралась из воздуха.
   */
  scale: number;
  /** Базовые дни изготовления этого типа. */
  days: number;
  /** Какие группы показываем. */
  groups: GroupId[];
  photo: string;
};

export const kinds: Kind[] = [
  {
    id: "kitchen",
    label: "Кухня",
    note: "Фронт, столешница, техника по нишам",
    unit: "м",
    amountLabel: "Длина фронта",
    amount: 4.6,
    min: 1.8,
    max: 12,
    step: 0.2,
    scale: 1,
    days: 15,
    groups: ["layout", "front", "top", "hardware", "light"],
    photo: "kitchen-oak",
  },
  {
    id: "wardrobe",
    label: "Шкаф-купе и гардеробная",
    note: "От одной стены до отдельной комнаты",
    unit: "м",
    amountLabel: "Ширина",
    amount: 3,
    min: 1,
    max: 8,
    step: 0.2,
    scale: 1,
    days: 12,
    groups: ["front", "fill", "hardware", "light"],
    photo: "walk-in",
  },
  {
    id: "living",
    label: "Гостиная: ТВ-зона и витрины",
    note: "Стенка под технику, полки и стекло",
    unit: "м",
    amountLabel: "Длина стенки",
    amount: 3.6,
    min: 1.4,
    max: 9,
    step: 0.2,
    scale: 1,
    days: 14,
    groups: ["front", "fill", "hardware", "light"],
    photo: "living-tv",
  },
  {
    id: "bedroom",
    label: "Спальня комплектом",
    note: "Шкаф, изголовье и две тумбы",
    unit: "комплект",
    amountLabel: "Комплектов",
    amount: 1,
    min: 1,
    max: 3,
    step: 1,
    scale: 3.4,
    days: 16,
    groups: ["front", "fill", "hardware", "light"],
    photo: "bedroom",
  },
  {
    id: "kids",
    label: "Детская",
    note: "Кровать, стол и хранение в рост",
    unit: "комплект",
    amountLabel: "Комплектов",
    amount: 1,
    min: 1,
    max: 3,
    step: 1,
    scale: 2.8,
    days: 14,
    groups: ["front", "fill", "hardware", "light"],
    photo: "study",
  },
  {
    id: "hall",
    label: "Прихожая",
    note: "Шкаф, зеркало и место, куда сесть",
    unit: "м",
    amountLabel: "Ширина",
    amount: 2,
    min: 0.8,
    max: 6,
    step: 0.2,
    scale: 1,
    days: 10,
    groups: ["front", "fill", "hardware", "light"],
    photo: "hall-doors",
  },
  {
    id: "bath",
    label: "Ванная",
    note: "Тумба под раковину и шкаф во влажной зоне",
    unit: "м",
    amountLabel: "Длина тумбы",
    amount: 1.2,
    min: 0.6,
    max: 4,
    step: 0.2,
    scale: 1,
    days: 12,
    groups: ["front", "top", "hardware", "light"],
    photo: "bath",
  },
  {
    id: "flat",
    label: "Квартира под ключ",
    note: "Кухня, шкафы, гостиная и спальни разом",
    unit: "комната",
    amountLabel: "Комнат",
    amount: 3,
    min: 1,
    max: 6,
    step: 1,
    scale: 6.2,
    days: 40,
    groups: ["front", "top", "fill", "hardware", "light"],
    photo: "housing-living",
  },
];

const kindById = new Map(kinds.map((kind) => [kind.id, kind]));

export function kindOf(id: KindId): Kind {
  return kindById.get(id) ?? kinds[0];
}

/* ------------------------------------------------------------------ */
/* Планировки — только у кухни                                         */
/* ------------------------------------------------------------------ */

/** `metres` — типовая длина фронта: подставляется в ползунок при выборе. */
export const layouts: (Option & { metres: number; plan: string })[] = [
  {
    id: "line",
    label: "Прямая",
    note: "Один фронт вдоль стены — для кухни-ниши и студии",
    perUnit: 0,
    days: 0,
    metres: 3.2,
    plan: "M4 20 H60 V40 H4 Z",
  },
  {
    id: "corner",
    label: "Угловая",
    note: "Г-образная: рабочий треугольник без лишних шагов",
    perUnit: 0,
    days: 2,
    metres: 4.6,
    plan: "M4 8 H24 V40 H60 V56 H4 Z",
  },
  {
    id: "u",
    label: "П-образная",
    note: "Три фронта: максимум хранения и рабочей поверхности",
    perUnit: 0,
    days: 4,
    metres: 6.2,
    plan: "M4 8 H20 V44 H44 V8 H60 V56 H4 Z",
  },
  {
    id: "island",
    label: "С островом",
    note: "Фронт плюс отдельный остров с варочной или мойкой",
    perUnit: 0.4,
    days: 6,
    metres: 5.4,
    plan: "M4 6 H60 V20 H4 Z M18 36 H46 V52 H18 Z",
  },
];

/* ------------------------------------------------------------------ */
/* 02 · Настройте под себя                                             */
/* ------------------------------------------------------------------ */

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
        perUnit: 4.2,
        days: 0,
        swatch: "matt-grey",
      },
      {
        id: "matt",
        label: "Крашеный МДФ, мат",
        note: "Эмаль Sirca: ровный матовый тон, не бликует и не собирает отпечатки",
        perUnit: 6.4,
        days: 5,
        swatch: "lacquer-white",
      },
      {
        id: "mirror",
        label: "Зеркало и стекло в раме",
        note: "Алюминиевая рамка, зеркало с плёнкой: осколки остаются на месте",
        perUnit: 6.9,
        days: 6,
        kinds: ["wardrobe", "hall", "bedroom", "living", "flat"],
      },
      {
        id: "milled",
        label: "Фрезерованный МДФ",
        note: "Классический фасад с фрезеровкой под покраску",
        perUnit: 7.8,
        days: 8,
        swatch: "milled-white",
      },
      {
        id: "veneer",
        label: "Шпон дуба",
        note: "Натуральный шпон: у каждой дверцы свой рисунок, повторить нельзя",
        perUnit: 9.6,
        days: 10,
        swatch: "veneer-oak",
      },
      {
        id: "graphite",
        label: "Графит, глянец",
        note: "Тёмная эмаль в глянце — эффектно, но показывает каждый отпечаток",
        perUnit: 7.1,
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
        perUnit: 0.9,
        days: 0,
      },
      {
        id: "quartz",
        label: "Кварцевый агломерат",
        note: "Не боится ножа и кипятка, шов почти не виден",
        perUnit: 3.4,
        days: 7,
        swatch: "stone-marble",
      },
      {
        id: "stone",
        label: "Натуральный камень",
        note: "Мрамор или гранит: рисунок неповторим, требует ухода",
        perUnit: 4.8,
        days: 10,
        swatch: "stone-dark",
      },
    ],
  },
  {
    id: "fill",
    label: "Наполнение",
    hint: "То, что внутри: из-за него шкафом или пользуются, или нет",
    options: [
      {
        id: "shelves",
        label: "Полки и штанга",
        note: "Базовое хранение: то, без чего шкаф не шкаф",
        perUnit: 0.6,
        days: 0,
      },
      {
        id: "boxes",
        label: "Ящики Blum с доводкой",
        note: "Полное выдвижение: видно всё, что лежит в глубине",
        perUnit: 1.8,
        days: 2,
      },
      {
        id: "carousel",
        label: "Выкатные корзины Vauth-Sagel",
        note: "Брючница, корзины и карго — угол перестаёт быть мёртвым",
        perUnit: 2.9,
        days: 4,
      },
      {
        id: "show",
        label: "Витрины со стеклом",
        note: "Стеклянные секции с подсветкой полок",
        perUnit: 3.6,
        days: 5,
        kinds: ["living", "flat"],
      },
    ],
  },
  {
    id: "hardware",
    label: "Фурнитура",
    hint: "Её не видно на фото, но именно ею мебель пользуется каждый день",
    options: [
      {
        id: "base",
        label: "Петли с доводчиком",
        note: "Базовый набор: дверцы закрываются мягко",
        perUnit: 0,
        days: 0,
      },
      {
        id: "blum",
        label: "Blum TANDEMBOX",
        note: "Ящики с полным выдвижением и доводкой — то, что чувствуется рукой",
        perUnit: 1.6,
        days: 2,
      },
      {
        id: "cinetto",
        label: "Cinetto: двери без порога",
        note: "Раздвижная система без нижней направляющей — нечему забиваться",
        perUnit: 2.4,
        days: 3,
        kinds: ["wardrobe", "hall", "living", "bedroom", "flat"],
      },
      {
        id: "full",
        label: "Blum AVENTOS + Vauth-Sagel",
        note: "Подъёмники на верхние фасады и выкатные карго в углы",
        perUnit: 3.1,
        days: 4,
        kinds: ["kitchen", "flat"],
      },
    ],
  },
  {
    id: "light",
    label: "Подсветка",
    hint: "Свет под полками и внутри витрин",
    options: [
      { id: "none", label: "Без подсветки", note: "Оставляем на потом", perUnit: 0, days: 0 },
      {
        id: "domus",
        label: "Domus Line",
        note: "Светодиодная лента с датчиком движения: открыл — зажглось",
        perUnit: 0.6,
        days: 1,
      },
    ],
  },
];

const groupById = new Map(groups.map((group) => [group.id, group]));

/** Варианты группы, которые имеют смысл для этого типа мебели. */
export function optionsFor(groupId: GroupId, kindId: KindId): Option[] {
  if (groupId === "layout") return layouts;
  const group = groupById.get(groupId);
  if (!group) return [];
  return group.options.filter((option) => !option.kinds || option.kinds.includes(kindId));
}

export function groupOf(groupId: GroupId): Group | undefined {
  return groupById.get(groupId);
}

/* ------------------------------------------------------------------ */
/* Надбавки: сроки и сборка                                            */
/* ------------------------------------------------------------------ */

export type Extra = {
  id: "rush" | "install";
  label: string;
  hint: string;
  options: {
    id: string;
    label: string;
    note: string;
    /** Во сколько раз меняет цену. */
    factor: number;
    /** Во сколько раз меняет срок. */
    pace: number;
  }[];
};

export const extras: Extra[] = [
  {
    id: "rush",
    label: "Сроки",
    hint: "Ускоренная очередь — это смена в цеху, поставленная под один заказ",
    options: [
      { id: "normal", label: "Обычные", note: "Заказ идёт в общей очереди", factor: 1, pace: 1 },
      {
        id: "fast",
        label: "Ускоренные",
        note: "Примерно на треть быстрее, дороже на 18%",
        factor: 1.18,
        pace: 0.7,
      },
    ],
  },
  {
    id: "install",
    label: "Замер, доставка и сборка",
    hint: "По умолчанию всё это делает их бригада",
    options: [
      { id: "full", label: "Делает фабрика", note: "Замер, подъём, сборка и подключение", factor: 1, pace: 1 },
      {
        id: "self",
        label: "Только изготовление",
        note: "Забираете сами и собираете своими силами",
        factor: 0.94,
        pace: 0.92,
      },
    ],
  },
];

const extraById = new Map(extras.map((extra) => [extra.id, extra]));

export function extraOptionOf(extraId: Extra["id"], optionId: string) {
  const extra = extraById.get(extraId);
  return extra?.options.find((option) => option.id === optionId) ?? extra!.options[0];
}

/* ------------------------------------------------------------------ */
/* Выбор и смета                                                       */
/* ------------------------------------------------------------------ */

export type Choice = {
  kind: KindId;
  amount: number;
  layout: string;
  front: string;
  top: string;
  fill: string;
  hardware: string;
  light: string;
  rush: string;
  install: string;
};

export const defaultChoice: Choice = {
  kind: "kitchen",
  amount: 4.6,
  layout: "corner",
  front: "matt",
  top: "quartz",
  fill: "boxes",
  hardware: "blum",
  light: "domus",
  rush: "normal",
  install: "full",
};

/**
 * Вариант, выбранный в группе.
 *
 * Выбор мог остаться от другого типа мебели — Cinetto от шкафа при
 * переходе на кухню, — поэтому проверяем не только существование, но и
 * применимость, и молча откатываемся на первый подходящий.
 */
export function optionOf(groupId: GroupId, optionId: string, kindId: KindId): Option {
  const list = optionsFor(groupId, kindId);
  return list.find((option) => option.id === optionId) ?? list[0];
}

export function layoutOf(choice: Choice) {
  return layouts.find((layout) => layout.id === choice.layout) ?? layouts[1];
}

export type Estimate = {
  kind: Kind;
  amount: number;
  /** Объём в погонных метрах фронта — то, из чего считается цена. */
  metres: number;
  /** Цена погонного метра, млн сум. */
  perMetre: number;
  low: number;
  high: number;
  /** Рабочих дней от заявки до установки. */
  days: number;
  /** Строки сметы для формы заявки и панели. */
  lines: { group: string; label: string; perUnit: number }[];
};

export function estimate(choice: Choice): Estimate {
  const kind = kindOf(choice.kind);
  const amount = clampAmount(kind, choice.amount);
  const metres = amount * kind.scale;

  const picks = kind.groups
    .filter((id) => id !== "layout")
    .map((id) => ({ group: groupOf(id)!, option: optionOf(id, choice[id], kind.id) }));

  const layout = kind.groups.includes("layout") ? layoutOf(choice) : undefined;
  const rush = extraOptionOf("rush", choice.rush);
  const install = extraOptionOf("install", choice.install);

  const perMetre =
    (layout?.perUnit ?? 0) + picks.reduce((sum, { option }) => sum + option.perUnit, 0);
  const total = perMetre * metres * rush.factor * install.factor;

  // Больше метров — дольше цех: сверх типового объёма срок растёт.
  const overtime = Math.max(0, metres - kind.amount * kind.scale) * 1.2;
  const days = Math.round(
    (kind.days +
      (layout?.days ?? 0) +
      picks.reduce((sum, { option }) => sum + option.days, 0) +
      overtime) *
      rush.pace *
      install.pace,
  );

  return {
    kind,
    amount,
    metres,
    perMetre,
    // Вилка, а не точка: точную цену называют после замера.
    low: total * 0.88,
    high: total * 1.12,
    days,
    lines: [
      ...(layout ? [{ group: "Планировка", label: layout.label, perUnit: layout.perUnit }] : []),
      ...picks.map(({ group, option }) => ({
        group: group.label,
        label: option.label,
        perUnit: option.perUnit,
      })),
      { group: "Сроки", label: rush.label, perUnit: 0 },
      { group: "Сборка", label: install.label, perUnit: 0 },
    ],
  };
}

/** Ползунок объёма не выпускает за границы типа и держит шаг. */
export function clampAmount(kind: Kind, amount: number): number {
  const stepped = Math.round(amount / kind.step) * kind.step;
  const bounded = Math.min(Math.max(stepped, kind.min), kind.max);
  return Math.round(bounded * 10) / 10;
}

/** «От» на карточке типа — самый дешёвый набор при типовом объёме. */
export function fromPrice(kind: Kind): number {
  const cheapest = kind.groups
    .filter((id) => id !== "layout")
    .reduce((sum, id) => sum + Math.min(...optionsFor(id, kind.id).map((o) => o.perUnit)), 0);
  return cheapest * kind.amount * kind.scale * 0.88;
}

/* ------------------------------------------------------------------ */
/* Расчёт от бюджета                                                   */
/* ------------------------------------------------------------------ */

/**
 * Обратная задача: не «сколько стоит то, что я выбрал», а «что помещается
 * в мои деньги».
 *
 * Так спрашивает человек, который уже отложил сумму, и на сайтах мебели
 * такого нет нигде: там сначала заставляют выбрать, а цену называют по
 * телефону. Перебираем все сочетания для выбранного типа и берём самое
 * дорогое из тех, чей верх вилки укладывается в бюджет.
 */
export function bestWithin(kind: Kind, amount: number, budget: number, base: Choice): Choice | null {
  const ids = kind.groups.filter((id) => id !== "layout");
  const fits: { choice: Choice; high: number }[] = [];

  const walk = (index: number, draft: Choice) => {
    if (index === ids.length) {
      const result = estimate(draft);
      if (result.high <= budget) fits.push({ choice: { ...draft }, high: result.high });
      return;
    }
    for (const option of optionsFor(ids[index], kind.id)) {
      walk(index + 1, { ...draft, [ids[index]]: option.id });
    }
  };

  walk(0, { ...base, kind: kind.id, amount });
  if (fits.length === 0) return null;
  return fits.reduce((best, item) => (item.high > best.high ? item : best)).choice;
}

/* ------------------------------------------------------------------ */
/* Формат                                                              */
/* ------------------------------------------------------------------ */

/** «62,4» — дробь одна, пробелы неразрывные. */
export function sums(value: number): string {
  return value
    .toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    .replace(/\s/g, " ");
}

/** «4,6 м», «1 комплект», «3 комнаты» — с окончанием по числу. */
export function volume(kind: Kind, amount: number): string {
  if (kind.unit === "м") return `${sums(amount)} п.м.`;
  const last = amount % 10;
  const teen = amount % 100 >= 11 && amount % 100 <= 14;
  const forms =
    kind.unit === "комплект"
      ? ["комплект", "комплекта", "комплектов"]
      : ["комната", "комнаты", "комнат"];
  if (!teen && last === 1) return `${amount} ${forms[0]}`;
  if (!teen && last >= 2 && last <= 4) return `${amount} ${forms[1]}`;
  return `${amount} ${forms[2]}`;
}

/**
 * «32 дня», «46 дней», «21 день».
 *
 * Число здесь считается, а не написано руками, поэтому окончание тоже
 * приходится считать: одиннадцать — двадцать один в русском ведут себя
 * не так, как их последние цифры.
 */
export function days(count: number): string {
  const last = count % 10;
  const teen = count % 100 >= 11 && count % 100 <= 14;
  if (!teen && last === 1) return `${count} день`;
  if (!teen && last >= 2 && last <= 4) return `${count} дня`;
  return `${count} дней`;
}

/** Дата готовности от сегодняшнего дня, словами. */
export function readyBy(days: number, from = new Date()): string {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}
