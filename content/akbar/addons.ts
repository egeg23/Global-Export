import { servicePages, studioServices } from "@/content/services";
import type { Catalog, CatalogAddon } from "@/lib/configurator/catalog";

/**
 * Конструктор сайта Akbar Rich — как у MAVERA: тумблер в доке включает
 * настоящий блок на странице, у свежего блока есть «было / стало», бриф
 * уходит в студию.
 *
 * Вариант один — сайт-каталог, каким он стоит на макете: дверь открывается
 * прокруткой, 30 разделов каталога, конструктор двери, три метра, скрытые
 * двери, дилерам, шоурум и заявка. Всё, что ниже, — допники: блоки сайта
 * нарисованы на главной, панель, языки и интеграции блока не имеют.
 *
 * Цен здесь нет: каталог уходит в браузер. Прайс — только на сервере,
 * в lib/configurator/prices.ts; рынок и расчёт — docs/akbar-research.md,
 * раздел 6.
 */
export const akbarAddons: CatalogAddon[] = [
  /* Главная — у каждого блок на странице. */
  { id: "prices", label: "Цены в конструкторе", effect: "Итог по набору в сумах сразу: полотно, коробка, наличники, фурнитура", where: "main" },
  { id: "installment", label: "Рассрочка Uzum Nasiya / Alif", effect: "Платёж в месяц на 3, 6 или 12 месяцев и заявка прямо из конструктора", where: "main" },
  { id: "favorites", label: "Подборка дверей в Telegram", effect: "«В подборку» запоминает собранную дверь, подборка уходит ссылкой в Telegram", where: "main" },
  { id: "tryon", label: "Примерка двери на фото комнаты", effect: "Покупатель загружает фото проёма — дверь встаёт поверх, её можно двигать и менять размер", where: "main" },
  { id: "dealer", label: "Кабинет дилера", effect: "Заказы, остатки и свои цены для 30+ дилерских сетей — без звонков на фабрику", where: "main" },
  { id: "journal", label: "Журнал о дверях и SEO-старт", effect: "Статьи «как выбрать дверь» на двух языках — под поиск в Google и Яндексе", where: "main" },
  { id: "tour", label: "Тур 360° по шоуруму", effect: "Зал на Малой кольцевой с телефона: крутите панораму и нажимайте на двери", where: "main" },
  { id: "measure", label: "Запись на замер", effect: "День и время замерщика в два нажатия — запись уходит в заявку", where: "main" },
  { id: "pay", label: "Предоплата онлайн: Payme, Click, Uzum", effect: "Внести предоплату за заказ со страницы, без поездки в шоурум и банк", where: "main" },
  { id: "chat", label: "Чат Telegram / WhatsApp", effect: "Плавающая кнопка мессенджера", where: "main" },

  /* Языки — переключатель в шапке, блока на макете нет. */
  { id: "uz", label: "Узбекская версия", effect: "Весь сайт и каталог на узбекском — переключатель RU / UZ в шапке", where: "langs" },
  { id: "en", label: "Английская версия", effect: "EN — для зарубежных дилеров и застройщиков", where: "langs" },

  /* Панель управления — блока на макете нет. */
  { id: "admin", label: "Панель управления каталогом", effect: "Модели, цвета, фото, главная и заявки — правите сами, без программиста", where: "panel" },
  { id: "excel", label: "Импорт и выгрузка каталога в Excel", effect: "Сотни позиций одним файлом — с предпросмотром перед загрузкой", where: "panel" },
  { id: "sync", label: "Остатки и цены из 1С / МойСклад / Billz", effect: "Склад и прайс фабрики сами попадают на сайт и в кабинет дилера", where: "panel" },

  /* Работа рядом с сайтом. */
  { id: "tg-bot", label: "Telegram-бот: заявки и статус заказа", effect: "Покупатель узнаёт статус заказа в Telegram, менеджер получает заявки туда же", where: "integrations" },
  { id: "crm", label: "Заявки в amoCRM / Bitrix24", effect: "Каждая заявка с сайта сразу становится сделкой в CRM", where: "integrations" },
];

export const akbarCatalog: Catalog = {
  project: "akbar",
  label: "Akbar Rich — сайт-каталог фабрики дверей",
  niche: "фабрика межкомнатных дверей, панелей и мебельных створок, Ташкент",
  nicheTier: 2,
  tiers: [{ id: "site", label: "Сайт-каталог" }],
  addons: [...akbarAddons, ...studioServices],
  included: { site: [] },
  pages: [
    { id: "main", label: "Главная" },
    { id: "langs", label: "Языки", shared: false, virtual: true },
    { id: "panel", label: "Панель управления", shared: false, virtual: true },
    ...servicePages,
  ],
  chat: { id: "chat", text: "Здравствуйте! Хочу подобрать двери.", site: "https://akbar-rich.uz" },
};

export function akbarHrefs(): Record<string, string> {
  return { main: "/akbar" };
}
