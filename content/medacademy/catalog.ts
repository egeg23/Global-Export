import { servicePages, studioServices } from "@/content/services";
import type { Catalog, CatalogAddon } from "@/lib/configurator/catalog";

/**
 * Конструктор сайта MedAcademy — как у MAVERA: тумблер в доке включает
 * настоящий блок на странице.
 *
 * Два варианта — два разных сайта (A «Клиника», B «Лаборатория»): у каждого
 * своя композиция, но набор допников один, и каждый блок нарисован в стиле
 * своего варианта. Все блоки живут на главной варианта, поэтому `where` у них
 * «везде», и тумблер никуда не переводит, а подъезжает к блоку на месте.
 *
 * Цен здесь нет: каталог уходит в браузер. Прайс — только на сервере,
 * в lib/configurator/prices.ts.
 */
export const medacademyAddons: CatalogAddon[] = [
  { id: "quiz", label: "Подбор курса: тест из 4 вопросов", effect: "Цель, класс, уровень, формат → какой курс и с чего начать", where: "site" },
  { id: "booking", label: "Запись на пробный урок и расписание наборов", effect: "Предмет, день и время — заявка уходит администратору с готовым текстом", where: "site" },
  { id: "cert", label: "Проверка сертификата по номеру", effect: "Номер с сертификата выпускника → чей, какой курс, когда выдан", where: "site" },
  { id: "cabinet", label: "Личный кабинет студента", effect: "Расписание, видеолекции, тесты с прогрессом и сертификаты — в одном месте", where: "site" },
  { id: "pay", label: "Онлайн-оплата курсов", effect: "Payme, Click, Uzum — оплата курса или месяца прямо со страницы", where: "site" },
  { id: "blog", label: "Блог и SEO-старт", effect: "Разборы задач и новости приёма — статьи под поиск «курсы химии Ташкент»", where: "site" },
  { id: "admin", label: "Панель управления", effect: "Курсы, цены, наборы, преподаватели и заявки правит сам центр", where: "site" },
  { id: "uz", label: "Узбекская версия", effect: "Переключатель RU / UZ в шапке", where: "site" },
  { id: "en", label: "Английская версия", effect: "Переключатель EN в шапке — для поступающих за рубеж", where: "site" },
  { id: "chat", label: "Чат Telegram / WhatsApp", effect: "Плавающая кнопка мессенджера", where: "site" },

  /* Работа рядом с сайтом — блока на макете нет. */
  { id: "tg-bot", label: "Telegram-бот заявок", effect: "Заявки, записи на пробный и оплаты приходят администратору в Telegram", where: "integrations" },
  { id: "crm", label: "Заявки в amoCRM / Bitrix24", effect: "Каждая заявка с сайта сразу становится сделкой в вашей CRM", where: "integrations" },
];

export const medacademyCatalog: Catalog = {
  project: "medacademy",
  label: "MedAcademy — сайт центра подготовки в медвузы",
  niche: "образование: подготовка к поступлению в медвузы, Ташкент",
  nicheTier: 2,
  tiers: [
    { id: "a", label: "Вариант A · Клиника" },
    { id: "b", label: "Вариант B · Лаборатория" },
  ],
  addons: [...medacademyAddons, ...studioServices],
  included: { a: [], b: [] },
  pages: [
    { id: "a", label: "Вариант A" },
    { id: "b", label: "Вариант B" },
    ...servicePages,
  ],
  everywhere: "site",
  everywhereLabel: "Сайт",
  chat: { id: "chat", text: "Здравствуйте! Хочу узнать про курсы MedAcademy.", site: "https://medacademy.uz" },
};

export function medacademyHrefs(): Record<string, string> {
  return { a: "/medacademy/a", b: "/medacademy/b" };
}
