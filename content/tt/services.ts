import type { Pair } from "@/content/tt/i18n";

/**
 * Конструктор подключения для бизнеса.
 *
 * Восемнадцать услуг с их сайта лежат там плоским списком иконок 60×60,
 * и выбрать из него нельзя ничего: непонятно, что с чем сочетается и во
 * что обойдётся. Здесь тот же список собран в конструктор: отмечаешь
 * нужное — видишь смету и срок подключения.
 *
 * Про цифры честно. Прайса «Транстелеком» не публикует, поэтому цены
 * здесь — ориентир по рынку корпоративной связи Казахстана, а не их
 * тариф; на странице это подписано, и в рабочем сайте таблица приходит
 * из панели управления. Все суммы в тенге, в месяц, кроме разовых
 * подключений — они отмечены отдельно.
 *
 * Названия услуг — их собственные, на обоих языках с их же страниц.
 */

export type Group = "net" | "voice" | "cloud" | "it";

export const groups: { id: Group; label: Pair; hint: Pair }[] = [
  {
    id: "net",
    label: { ru: "Каналы связи", kk: "Байланыс арналары" },
    hint: {
      ru: "То, по чему пойдут данные между офисами и наружу",
      kk: "Кеңселер арасында және сыртқа деректер жүретін арна",
    },
  },
  {
    id: "voice",
    label: { ru: "Голос", kk: "Дауыс" },
    hint: { ru: "Телефония офиса и работа со звонками", kk: "Кеңсе телефониясы және қоңыраулар" },
  },
  {
    id: "cloud",
    label: { ru: "Дата-центр", kk: "Дата-орталық" },
    hint: { ru: "Где будут жить серверы и данные", kk: "Серверлер мен деректер қайда тұрады" },
  },
  {
    id: "it",
    label: { ru: "ИТ-сервисы", kk: "АТ-қызметтері" },
    hint: { ru: "Всё, что вокруг: места, печать, документы", kk: "Айналасындағының бәрі" },
  },
];

export type Service = {
  id: string;
  group: Group;
  label: Pair;
  note: Pair;
  /** Тенге в месяц за единицу. */
  monthly: number;
  /** Разовое подключение, тенге. */
  setup: number;
  /** Рабочих дней на подключение. */
  days: number;
  /** Масштабируется ли цена от числа рабочих мест. */
  perSeat?: boolean;
  /** Требует другой услуги: без канала нет ни телефонии, ни VPN. */
  needs?: string;
};

export const services: Service[] = [
  {
    id: "internet",
    group: "net",
    label: { ru: "Интернет по выделенному каналу", kk: "Бөлінген арна бойынша интернет" },
    note: {
      ru: "Выделенный цифровой канал из существующей или новой ВОЛС",
      kk: "Қолданыстағы немесе жаңа ТОБЖ-дан бөлінген цифрлық арна",
    },
    monthly: 180_000,
    setup: 240_000,
    days: 14,
  },
  {
    id: "ipvpn",
    group: "net",
    label: { ru: "IP VPN между офисами", kk: "Кеңселер арасындағы IP VPN" },
    note: {
      ru: "Закрытая от внешнего доступа сеть поверх магистрали",
      kk: "Магистраль үстіндегі сырттан жабық желі",
    },
    monthly: 145_000,
    setup: 180_000,
    days: 10,
    needs: "internet",
  },
  {
    id: "ipls",
    group: "net",
    label: { ru: "Аренда магистрального канала", kk: "Магистральдық арнаны жалға алу" },
    note: { ru: "Свой ресурс в ВОЛС между городами", kk: "Қалалар арасындағы ТОБЖ ресурсы" },
    monthly: 520_000,
    setup: 400_000,
    days: 21,
  },
  {
    id: "telephony",
    group: "voice",
    label: { ru: "Телефония", kk: "Телефония" },
    note: { ru: "Городские номера и связь для офиса", kk: "Қалалық нөмірлер және кеңсе байланысы" },
    monthly: 4_200,
    setup: 12_000,
    days: 5,
    perSeat: true,
    needs: "internet",
  },
  {
    id: "pbx",
    group: "voice",
    label: { ru: "Виртуальная АТС", kk: "Виртуалды АТС" },
    note: {
      ru: "Обработка звонков и контроль работы сотрудников",
      kk: "Қоңырауларды өңдеу және қызметкерлерді бақылау",
    },
    monthly: 95_000,
    setup: 60_000,
    days: 4,
    needs: "internet",
  },
  {
    id: "callcenter",
    group: "voice",
    label: { ru: "Контакт-центр", kk: "Байланыс орталығы" },
    note: {
      ru: "Обработка звонков и каналы связи с клиентами",
      kk: "Қоңырауларды өңдеу және клиенттермен байланыс",
    },
    monthly: 310_000,
    setup: 250_000,
    days: 15,
    needs: "pbx",
  },
  {
    id: "colocation",
    group: "cloud",
    label: { ru: "Co-location", kk: "Co-location" },
    note: {
      ru: "Ваши серверы на нашей площадке Tier 3 с резервом каналов и питания",
      kk: "Сіздің серверлер Tier 3 алаңымызда, арна мен қуат резервімен",
    },
    monthly: 240_000,
    setup: 150_000,
    days: 7,
  },
  {
    id: "vdc",
    group: "cloud",
    label: { ru: "Virtual Data Center", kk: "Virtual Data Center" },
    note: {
      ru: "Облако вместо своей серверной: масштабируется под задачу",
      kk: "Өз серверлік бөлмесінің орнына бұлт: міндетке қарай масштабталады",
    },
    monthly: 320_000,
    setup: 90_000,
    days: 3,
  },
  {
    id: "security",
    group: "cloud",
    label: { ru: "Кибербезопасность", kk: "Киберқауіпсіздік" },
    note: {
      ru: "Защита периметра, ЭЦП и реагирование на инциденты",
      kk: "Периметрді қорғау, ЭЦҚ және оқиғаларға жауап беру",
    },
    monthly: 280_000,
    setup: 200_000,
    days: 12,
  },
  {
    id: "workplace",
    group: "it",
    label: { ru: "Организация рабочих мест", kk: "Жұмыс орындарын ұйымдастыру" },
    note: {
      ru: "Техника, мебель, сервис печати и поддержка сотрудников",
      kk: "Техника, жиһаз, басып шығару қызметі және қолдау",
    },
    monthly: 18_500,
    setup: 0,
    days: 10,
    perSeat: true,
  },
  {
    id: "itsm",
    group: "it",
    label: { ru: "Услуги ITSM", kk: "ITSM қызметтері" },
    note: {
      ru: "Единая облачная платформа обслуживания на ServiceNow",
      kk: "ServiceNow негізіндегі біріңғай бұлттық платформа",
    },
    monthly: 230_000,
    setup: 180_000,
    days: 20,
  },
  {
    id: "edo",
    group: "it",
    label: { ru: "Электронный документооборот", kk: "Электрондық құжат айналымы" },
    note: { ru: "Документы и электронный архив", kk: "Құжаттар және электрондық мұрағат" },
    monthly: 6_800,
    setup: 140_000,
    days: 12,
    perSeat: true,
  },
  {
    id: "video",
    group: "it",
    label: { ru: "Видео-конференцсвязь", kk: "Бейнеконференцбайланыс" },
    note: { ru: "Совещания между филиалами", kk: "Филиалдар арасындағы кеңестер" },
    monthly: 88_000,
    setup: 45_000,
    days: 5,
    needs: "internet",
  },
];

const byId = new Map(services.map((service) => [service.id, service]));

export function serviceOf(id: string): Service | undefined {
  return byId.get(id);
}

export type Quote = {
  monthly: number;
  setup: number;
  days: number;
  lines: { id: string; label: Pair; monthly: number; setup: number }[];
  /** Услуги, включённые автоматически, потому что без них выбранное не работает. */
  forced: string[];
};

/**
 * Смета подключения.
 *
 * Без канала связи не работают ни телефония, ни ВКС, ни VPN, поэтому
 * зависимости включаются сами — и об этом честно сообщается в составе,
 * а не дописывается к сумме молча.
 *
 * Срок — не сумма сроков: бригада ведёт работы параллельно. Берём
 * самый долгий и добавляем по два дня на каждую следующую услугу.
 */
export function quote(picked: string[], seats: number): Quote {
  const chosen = new Set(picked);
  const forced: string[] = [];

  for (const id of picked) {
    const need = byId.get(id)?.needs;
    if (need && !chosen.has(need)) {
      chosen.add(need);
      forced.push(need);
    }
  }

  const list = [...chosen].map((id) => byId.get(id)!).filter(Boolean);
  const lines = list.map((service) => ({
    id: service.id,
    label: service.label,
    monthly: service.perSeat ? service.monthly * seats : service.monthly,
    setup: service.setup,
  }));

  const monthly = lines.reduce((sum, line) => sum + line.monthly, 0);
  const setup = lines.reduce((sum, line) => sum + line.setup, 0);
  const longest = list.reduce((max, service) => Math.max(max, service.days), 0);
  const days = list.length ? longest + (list.length - 1) * 2 : 0;

  return { monthly, setup, days, lines, forced };
}

/** «1 240 000 ₸» — пробелы неразрывные, чтобы сумма не переносилась. */
export function tenge(value: number): string {
  return `${Math.round(value).toLocaleString("ru-RU").replace(/\s/g, " ")} ₸`;
}
