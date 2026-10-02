/**
 * Факты об Arsenal D (webname.uz) для макета их нового сайта.
 *
 * Всё, что ниже не помечено «придумано», снято с их же сайта 02.10.2026
 * (webname.uz, страницы «Хостинг», «Прайс-лист», «SSL», «О компании»,
 * новости, кабинет). Источники и разбор — docs/webname-research.md.
 *
 * Цены:
 *  - хостинг — в сумах в месяц. Из-за пределов Узбекистана сайт пересчитывает
 *    их в рубли; сумы восстановлены по их же таблице тарифа («Абонентская
 *    плата (Сум) 3000» у Silver 50M) и сходятся с тарифами 3 000–45 000 сум
 *    на старом arsenal-d.uz;
 *  - международные зоны и SSL — в сумах, как в их прайсе;
 *  - .UZ — 35 000 сум в год по каталогу registrars.uz: их собственный сайт
 *    из-за границы сумовую цену .UZ не показывает. Перед показом клиенту —
 *    сверить.
 */

export const brand = {
  name: "Arsenal D",
  site: "webname.uz",
  /** Как компания сама себя описывает на сайте. */
  about:
    "Создание сайтов и программные разработки, регистрация доменов второго уровня в зоне .UZ, хостинг, VDS/VPS, DNSSEC, SSL- и NFT-сертификаты.",
};

export const contacts = {
  phones: [
    { label: "+998 78 150-21-52", href: "tel:+998781502152" },
    { label: "+998 78 150-11-51", href: "tel:+998781501151" },
  ],
  telegram: "Webnameuz",
  freeChannel: "webname_free_domains",
  email: "info@arsenal-d.uz",
  address: "Ташкент, Шайхонтохурский район, улица Себзар, 56а",
  hours: "Пн–Сб, 9:00–18:00, обед 13:00–14:00",
  app: "https://play.google.com/store/apps/details?id=com.webnameapp",
  cabinet: "https://webname.uz/register",
};

/** Ссылка в Telegram с готовым текстом — главное действие макета. */
export function tgHref(text: string): string {
  return `https://t.me/${contacts.telegram}?text=${encodeURIComponent(text)}`;
}

export const mapHref = "https://yandex.uz/maps/?text=%D0%A2%D0%B0%D1%88%D0%BA%D0%B5%D0%BD%D1%82%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%A1%D0%B5%D0%B1%D0%B7%D0%B0%D1%80%2C%2056%D0%B0";

/* ------------------------------------------------------------------ */
/* Домены                                                              */
/* ------------------------------------------------------------------ */

export type Zone = {
  zone: string;
  /** Сумы в год; null — цену называет менеджер. */
  price: number | null;
  /** Откуда цена — для подписи под строкой. */
  note?: string;
};

/** Зоны в поиске на первом экране. Цены международных — из их прайса. */
export const zones: Zone[] = [
  { zone: ".uz", price: 35_000, note: "по каталогу registrars.uz" },
  { zone: ".com", price: 205_000 },
  { zone: ".org", price: 220_000 },
  { zone: ".net", price: 245_000 },
  { zone: ".xyz", price: 265_000 },
  { zone: ".kz", price: 335_000 },
  { zone: ".app", price: 340_000 },
  { zone: ".dev", price: 310_000 },
  { zone: ".shop", price: 720_000 },
  { zone: ".io", price: 1_060_000 },
];

/**
 * Освободившиеся домены — список с их главной (02.10.2026) и из
 * Telegram-канала @webname_free_domains.
 */
export const freedDomains = [
  "freeedu.uz",
  "ecrs.uz",
  "rs-stroy.uz",
  "prokotelnoe.uz",
  "khamza.uz",
  "themagicgroup.uz",
  "studyinireland.uz",
  "arslantatu.uz",
  "pedkadir.uz",
  "makeme.uz",
  "yangidavrhost.uz",
  "ziyobuildings.uz",
  "silkroadpay.uz",
  "xynx.uz",
  "medpartner.uz",
  "ummaplus.uz",
];

/* ------------------------------------------------------------------ */
/* Хостинг                                                             */
/* ------------------------------------------------------------------ */

export type Plan = {
  name: string;
  family: "Silver" | "Gold" | "Platin" | "Diamant" | "Brillant";
  /** Диск, Мб. */
  disk: number;
  /** Сумы в месяц. */
  month: number;
  sites: number | "∞";
  dbs: number | "∞";
  mail: number | "∞";
};

/** Тарифы shared-хостинга — названия и состав с их страницы «Хостинг». */
export const plans: Plan[] = [
  { name: "Silver 50M", family: "Silver", disk: 50, month: 3_000, sites: 1, dbs: 3, mail: 5 },
  { name: "Gold 100M", family: "Gold", disk: 100, month: 6_000, sites: 2, dbs: 5, mail: 10 },
  { name: "Gold 150M", family: "Gold", disk: 150, month: 9_000, sites: 3, dbs: 6, mail: 20 },
  { name: "Platin 200M", family: "Platin", disk: 200, month: 12_000, sites: 4, dbs: 5, mail: 40 },
  { name: "Platin 250M", family: "Platin", disk: 250, month: 15_000, sites: 5, dbs: 8, mail: "∞" },
  { name: "Platin 300M", family: "Platin", disk: 300, month: 18_000, sites: "∞", dbs: "∞", mail: "∞" },
  { name: "Diamant 400M", family: "Diamant", disk: 400, month: 22_000, sites: "∞", dbs: "∞", mail: "∞" },
  { name: "Diamant 500M", family: "Diamant", disk: 500, month: 25_000, sites: "∞", dbs: "∞", mail: "∞" },
  { name: "Diamant 800M", family: "Diamant", disk: 800, month: 38_000, sites: "∞", dbs: "∞", mail: "∞" },
  { name: "Brillant 1G", family: "Brillant", disk: 1024, month: 45_000, sites: "∞", dbs: "∞", mail: "∞" },
];

/** Всего тарифов на их странице — от Silver 50M до Brillant Unlimited. */
export const plansTotal = 23;

/* ------------------------------------------------------------------ */
/* SSL                                                                 */
/* ------------------------------------------------------------------ */

export const ssl = [
  { name: "Sectigo PositiveSSL", kind: "DV · один домен", price: 110_000 },
  { name: "RapidSSL Standard", kind: "DV · один домен", price: 185_000 },
  { name: "GeoTrust QuickSSL Premium", kind: "DV · один домен", price: 795_000 },
  { name: "Sectigo PositiveSSL Wildcard", kind: "DV · все поддомены", price: 1_370_000 },
];

/* ------------------------------------------------------------------ */
/* Остальное с их сайта                                                */
/* ------------------------------------------------------------------ */

/** Сайты из их перечня «Наши клиенты» — только адреса, без логотипов. */
export const clientSites = ["triholog.uz", "uzmaru.uz", "e-tijorat.uz", "muxlis.uz", "surxonchinni.uz", "uzrvb.uz", "fencing.uz", "gubkin.uz"];

/** Плановые работы — из их новостей за 2026 год. */
export const maintenance = [
  { date: "11.07.2026", time: "22:00–24:00", what: "Виртуальные серверы" },
  { date: "07.06.2026", time: "23:00–24:00", what: "Хостинг и виртуальные серверы" },
  { date: "07.05.2026", time: "22:00–22:30", what: "Хостинг" },
  { date: "29.04.2026", time: "15:30–16:00", what: "Сервер web3.webspace.uz" },
];

/** Типовые бланки, которые лежат у них на сайте, — для шага «перенос». */
export const forms = {
  registrarChangePerson: "https://api.data.webname.uz/media/filer_public/files/2024-09-04/o_smene_registratora_fiz_litso_rus.doc",
  registrarChangeCompany: "https://api.data.webname.uz/media/filer_public/files/2024-09-04/o_smene_registratora_ot_iur_litsa_rus.doc",
  nsChange: "https://api.data.webname.uz/media/filer_public/files/2024-09-04/smena-ns-ip-iur-litso-rus.docx",
};

export function sum(value: number): string {
  return `${value.toLocaleString("ru-RU").replace(/ /g, " ")} сум`;
}
