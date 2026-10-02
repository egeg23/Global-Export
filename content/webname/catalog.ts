import { servicePages, studioServices } from "@/content/services";
import type { Catalog, CatalogAddon } from "@/lib/configurator/catalog";

/**
 * Конструктор сайта Arsenal D (webname.uz) — как у MAVERA: тумблер в доке
 * включает настоящий блок на странице, у свежего блока есть «было / стало»,
 * бриф уходит в студию.
 *
 * Вариант один — «сочная» версия со всеми фишками. Базовый сайт — поиск
 * домена с печатью, услуги, тарифы, глобус зон, жизненный цикл домена,
 * контакты. Всё, что ниже, — допники, и каждый нарисован на странице.
 *
 * Цен здесь нет: каталог уходит в браузер. Прайс — только на сервере,
 * в lib/configurator/prices.ts.
 */
export const webnameAddons: CatalogAddon[] = [
  { id: "logo-a", label: "Новый логотип · A «Адрес» (arsenal.d)", effect: "Имя как домен, знак «.d» — меняется в шапке и подвале на всех страницах", where: "site", exclusive: "logo" },
  { id: "logo-b", label: "Новый логотип · B «Щит»", effect: "Щит с буквой D и звездой из старого знака — меняется в шапке и подвале на всех страницах", where: "site", exclusive: "logo" },
  { id: "whois", label: "Живая проверка домена через реестр .UZ", effect: "Поиск на первом экране спрашивает реестр и WHOIS по-настоящему, а не в демо-режиме", where: "main" },
  { id: "board", label: "Табло освободившихся доменов", effect: "Домены, которые только что освободились, перелистываются на табло — как в аэропорту", where: "main" },
  { id: "calc", label: "Калькулятор «домен + хостинг + сайт»", effect: "Зона, тариф, SSL и сайт — итог в сумах и заявка в Telegram одним нажатием", where: "main" },
  { id: "compare", label: "Сравнение тарифов хостинга", effect: "Три тарифа рядом: диск, сайты, базы, почта — разница подсвечена", where: "main" },
  { id: "transfer", label: "Перенос домена и сайта в три шага", effect: "Мастер переноса от другого регистратора: бланк, подтверждение, DNS", where: "main" },
  { id: "dns", label: "DNS-панель в браузере", effect: "Записи A, CNAME, MX и TXT, готовые наборы для почты и сайта — без звонка в поддержку", where: "main" },
  { id: "status", label: "Статус серверов и плановые работы", effect: "Пульс хостинга, DNS и почты онлайн и график работ вместо новостей", where: "main" },
  { id: "cabinet", label: "Новый личный кабинет", effect: "Домены, сроки продления, счета и договоры — карточками, с телефона", where: "main" },
  { id: "pay", label: "Онлайн-оплата Payme, Click, Uzum", effect: "Продлить домен или хостинг прямо со страницы, без счёта и банка", where: "main" },
  { id: "uz", label: "Узбекская версия", effect: "Переключатель RU / UZ в шапке", where: "site" },
  { id: "en", label: "Английская версия", effect: "Переключатель EN — для клиентов из-за рубежа", where: "site" },
  { id: "chat", label: "Чат Telegram / WhatsApp", effect: "Плавающая кнопка мессенджера", where: "site" },

  /* Работа рядом с сайтом — блока на макете нет. */
  { id: "tg-bot", label: "Telegram-бот: продление и уведомления", effect: "Напоминает о сроке домена, принимает оплату и заявки в Telegram", where: "integrations" },
  { id: "crm", label: "Заявки в amoCRM / Bitrix24", effect: "Каждая заявка с сайта сразу становится сделкой в CRM", where: "integrations" },
  { id: "blog", label: "База знаний и SEO-старт", effect: "Статьи «что такое DNSSEC», «как перенести домен» — под поиск, на трёх языках", where: "integrations" },
];

export const webnameCatalog: Catalog = {
  project: "webname",
  label: "Arsenal D — сайт регистратора .UZ и хостинга",
  niche: "домены .UZ, хостинг, SSL и сайты, Ташкент",
  nicheTier: 2,
  tiers: [{ id: "full", label: "Сочная версия" }],
  addons: [...webnameAddons, ...studioServices],
  included: { full: [] },
  pages: [{ id: "main", label: "Главная" }, { id: "domains", label: "Регистрация домена" }, { id: "hosting", label: "Заказ хостинга" }, ...servicePages],
  everywhere: "site",
  everywhereLabel: "Сайт",
  chat: { id: "chat", text: "Здравствуйте! Хочу зарегистрировать домен.", site: "https://webname.uz" },
};

export function webnameHrefs(): Record<string, string> {
  return { main: "/webname/registry", domains: "/webname/registry/domains", hosting: "/webname/registry/hosting" };
}

/**
 * Вариант «Премиум» — жидкое стекло. Тот же набор блоков и допов, свои
 * страницы: тумблер с пошаговых страниц ведёт на главную этого варианта.
 * Отдельный проект в каталоге, чтобы набор тумблеров и бриф не смешивались
 * с «Реестром».
 */
export const webnamePremiumCatalog: Catalog = {
  ...webnameCatalog,
  project: "webname-premium",
  label: "Arsenal D — сайт регистратора .UZ, вариант «Премиум»",
  tiers: [{ id: "premium", label: "Премиум · жидкое стекло" }],
  included: { premium: [] },
};

export function webnamePremiumHrefs(): Record<string, string> {
  return { main: "/webname/premium", domains: "/webname/premium/domains", hosting: "/webname/premium/hosting" };
}
