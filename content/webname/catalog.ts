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
  { id: "whois", label: "Живая проверка домена через реестр .UZ", effect: "Поиск на первом экране спрашивает реестр и WHOIS по-настоящему, а не в демо-режиме", where: "site" },
  { id: "board", label: "Табло освободившихся доменов", effect: "Домены, которые только что освободились, перелистываются на табло — как в аэропорту", where: "site" },
  { id: "calc", label: "Калькулятор «домен + хостинг + сайт»", effect: "Зона, тариф, SSL и сайт — итог в сумах и заявка в Telegram одним нажатием", where: "site" },
  { id: "compare", label: "Сравнение тарифов хостинга", effect: "Три тарифа рядом: диск, сайты, базы, почта — разница подсвечена", where: "site" },
  { id: "transfer", label: "Перенос домена и сайта в три шага", effect: "Мастер переноса от другого регистратора: бланк, подтверждение, DNS", where: "site" },
  { id: "dns", label: "DNS-панель в браузере", effect: "Записи A, CNAME, MX и TXT, готовые наборы для почты и сайта — без звонка в поддержку", where: "site" },
  { id: "status", label: "Статус серверов и плановые работы", effect: "Пульс хостинга, DNS и почты онлайн и график работ вместо новостей", where: "site" },
  { id: "cabinet", label: "Новый личный кабинет", effect: "Домены, сроки продления, счета и договоры — карточками, с телефона", where: "site" },
  { id: "pay", label: "Онлайн-оплата Payme, Click, Uzum", effect: "Продлить домен или хостинг прямо со страницы, без счёта и банка", where: "site" },
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
  pages: [{ id: "main", label: "Главная" }, ...servicePages],
  everywhere: "site",
  everywhereLabel: "Сайт",
  chat: { id: "chat", text: "Здравствуйте! Хочу зарегистрировать домен.", site: "https://webname.uz" },
};

export function webnameHrefs(): Record<string, string> {
  return { main: "/webname" };
}
