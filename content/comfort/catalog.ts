import { servicePages, studioServices } from "@/content/services";
import type { Catalog, CatalogAddon } from "@/lib/configurator/catalog";

/**
 * Конструктор сайта Comfort Mebel — как у MAVERA: тумблер в доке включает
 * настоящий блок на странице.
 *
 * Две палитры — два варианта одного сайта: состав у них одинаковый, и набор
 * допников у каждой свой (ключ хранилища — проект и вариант). Все блоки
 * живут на главной обеих палитр, поэтому `where` у них — «везде», и тумблер
 * никуда не переводит, а подъезжает к блоку на месте.
 *
 * Цен здесь нет: каталог уходит в браузер. Прайс — только на сервере,
 * в lib/configurator/prices.ts.
 */
export const comfortAddons: CatalogAddon[] = [
  { id: "fit", label: "«Влезет ли» — подбор по размерам", effect: "Стена, глубина, дверь и потолок → план комнаты в масштабе и модели, которые встанут", where: "site" },
  { id: "installment", label: "Калькулятор рассрочки", effect: "Цена в месяц на 3, 6 и 12 месяцев по ценам каталога — в карточках и отдельным блоком", where: "site" },
  { id: "catalog", label: "Каталог: фильтры, избранное, сравнение", effect: "Фильтр по цене и ширине, сердечко на карточке, сравнение до трёх моделей", where: "site" },
  { id: "colors", label: "Конфигуратор цвета и ткани", effect: "Цвет модели меняется на её настоящих фотографиях", where: "site" },
  { id: "view3d", label: "3D / AR-просмотр 1–3 моделей", effect: "Модель со всех сторон: кадры тянутся пальцем, в работе — 3D и AR", where: "site" },
  { id: "booking", label: "Запись в шоурум с выбором даты", effect: "Филиал, день и время визита — менеджер готовит модели к приходу", where: "site" },
  { id: "admin", label: "Панель управления", effect: "Товары, цены, фото и филиалы правит сам магазин — без разработчика", where: "site" },
  { id: "uz", label: "Узбекская версия", effect: "Переключатель RU / UZ в шапке", where: "site" },
  { id: "chat", label: "Чат WhatsApp / Telegram", effect: "Плавающая кнопка мессенджера", where: "site" },

  /* Работа рядом с сайтом — блока на макете нет. */
  { id: "tg-bot", label: "Telegram-бот заявок", effect: "Заявки, записи и расчёты рассрочки приходят менеджерам в Telegram", where: "integrations" },
  { id: "stock", label: "Выгрузка склада / 1С", effect: "Цены и наличие подтягиваются из учёта сами", where: "integrations" },
  { id: "seo-start", label: "SEO-старт", effect: "Структура, метатеги и карточки под поиск «диван Ташкент», «шкаф-купе»", where: "growth" },
];

export const comfortCatalog: Catalog = {
  project: "comfort",
  label: "Comfort Mebel — сайт мебельной фабрики",
  niche: "мебель: производство и розница, Ташкент",
  nicheTier: 2,
  tiers: [
    { id: "a", label: "Палитра A · Wine Ash" },
    { id: "b", label: "Палитра B · Cosmic" },
  ],
  addons: [...comfortAddons, ...studioServices],
  included: { a: [], b: [] },
  pages: [
    { id: "a", label: "Палитра A" },
    { id: "b", label: "Палитра B" },
    ...servicePages,
  ],
  everywhere: "site",
  everywhereLabel: "Сайт",
  chat: { id: "chat", text: "Здравствуйте! Интересует мебель Comfort Mebel.", site: "https://comfort-mebel.uz" },
};

export function comfortHrefs(): Record<string, string> {
  return { a: "/comfort/a", b: "/comfort/b" };
}
