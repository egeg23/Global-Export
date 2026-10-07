import { servicePages, studioServices } from "@/content/services";
import type { Catalog, CatalogAddon } from "@/lib/configurator/catalog";

/**
 * Конструктор сайта Apollo Travel — как у Akbar Rich: тумблер в доке включает
 * настоящий блок на странице, бриф уходит в студию.
 *
 * Вариант один — их сайт, переодетый целиком: поиск туров (движок Tourvisor
 * остаётся, мы оформляем форму, ожидание и выдачу), горящие туры, тарифы
 * авиакомпаний, страны, о компании, блог, контакты. Всё ниже — допники.
 *
 * Цен здесь нет: каталог уходит в браузер. Прайс — только на сервере,
 * lib/configurator/prices.ts.
 */
export const apolloAddons: CatalogAddon[] = [
  /* Главная — у каждого блок на странице. */
  { id: "budget", label: "«Куда полететь на мой бюджет»", effect: "Ползунок бюджета — на глобусе загораются направления, куда хватает", where: "main" },
  { id: "calendar", label: "Календарь низких цен", effect: "Цена тура по дням вылета на месяц вперёд — самые дешёвые даты видно сразу", where: "main" },
  { id: "flight-search", label: "Поиск авиабилетов онлайн", effect: "Форма авиапоиска с выдачей по всем авиакомпаниям — белая метка Aviasales", where: "main" },
  { id: "visa", label: "Визовый помощник", effect: "Страна → нужна ли виза по паспорту Узбекистана, сроки и документы", where: "main" },
  { id: "installment", label: "Тур в рассрочку Uzum Nasiya / Alif", effect: "Платёж в месяц на 3, 6 или 12 месяцев прямо в карточке тура", where: "main" },
  { id: "pay", label: "Онлайн-оплата Payme, Click, Uzum", effect: "Предоплата за тур с сайта, без поездки в офис", where: "main" },
  { id: "tg-hot", label: "Горящие туры в Telegram сами", effect: "Свежие горящие из модуля уходят в их канал @apollotravel_uz без ручного постинга", where: "main" },
  { id: "reviews", label: "Отзывы с Яндекс Карт", effect: "Живые отзывы и рейтинг офиса на Лабзаке — прямо на главной", where: "main" },
  { id: "journal", label: "Журнал туриста и SEO-старт", effect: "Статьи о странах, визах и сезонах — под поиск в Google и Яндексе", where: "main" },
  { id: "chat", label: "Чат Telegram / WhatsApp", effect: "Плавающая кнопка мессенджера", where: "main" },

  /* Языки — переключатель в шапке, блока на макете нет. */
  { id: "uz", label: "Узбекская версия", effect: "Весь сайт на узбекском — переключатель RU / UZ в шапке, без машинного перевода", where: "langs" },
  { id: "en", label: "Английская версия", effect: "EN — для иностранцев, которые летят из Ташкента", where: "langs" },

  /* Панель управления — блока на макете нет. */
  { id: "admin", label: "Панель управления", effect: "Подборки, баннеры, тарифы авиакомпаний, блог и заявки — правите сами", where: "panel" },

  /* Работа рядом с сайтом. */
  { id: "tg-bot", label: "Telegram-бот: подбор и заявки", effect: "Подбор тура в боте, заявки — менеджерам в Telegram", where: "integrations" },
  { id: "crm", label: "Заявки в amoCRM / Bitrix24", effect: "Каждая заявка и поиск с сайта сразу становятся сделкой в CRM", where: "integrations" },
];

export const apolloCatalog: Catalog = {
  project: "apollo",
  label: "Apollo Travel — сайт турагентства",
  niche: "турагентство, поиск туров и авиабилетов, Ташкент",
  nicheTier: 2,
  tiers: [{ id: "site", label: "Сайт турагентства" }],
  addons: [...apolloAddons, ...studioServices],
  included: { site: [] },
  pages: [
    { id: "main", label: "Главная" },
    { id: "langs", label: "Языки", shared: false, virtual: true },
    { id: "panel", label: "Панель управления", shared: false, virtual: true },
    ...servicePages,
  ],
  chat: { id: "chat", text: "Здравствуйте! Хочу подобрать тур.", site: "https://goapollo.uz" },
};

export function apolloHrefs(): Record<string, string> {
  return { main: "/apollo" };
}
