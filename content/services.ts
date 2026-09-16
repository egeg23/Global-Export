import type { CatalogAddon, CatalogPage } from "@/lib/configurator/catalog";

/**
 * Услуги студии сверх сайта — одни на все проекты витрины.
 *
 * Это не блоки на макете, а работа рядом с ним: интеграции, ИИ-агенты,
 * статьи по подписке. Тумблер здесь ничего не показывает на странице —
 * только добавляет строку в цену и в бриф. Группы помечены `virtual`, и док
 * это честно подписывает.
 *
 * Цены — прайс студии. Подписка считается в месяц и в разовый итог не
 * входит; «от» значит, что точную сумму назовём после разговора; «по
 * запросу» в цену не входит вовсе.
 */
export const servicePages: CatalogPage[] = [
  { id: "integrations", label: "Интеграции и ИИ", shared: false, virtual: true },
  { id: "growth", label: "Продвижение · подписка", shared: false, virtual: true },
];

export const studioServices: CatalogAddon[] = [
  /* Интеграции и ИИ */
  {
    id: "crm-link",
    label: "Интеграция с вашей CRM",
    priceUsd: 1300,
    effect: "Заявки и статусы ходят в вашу CRM по API в обе стороны",
    where: "integrations",
  },
  {
    id: "crm-own",
    label: "Своя CRM с контролем качества",
    priceUsd: 4000,
    effect: "Воронка, задачи, запись разговоров и оценка каждого диалога",
    where: "integrations",
  },
  {
    id: "ai-support",
    label: "ИИ-агенты на первую линию",
    priceUsd: 2600,
    effect: "Отвечают на сайте и в мессенджерах, квалифицируют и передают менеджеру",
    where: "integrations",
  },
  {
    id: "ai-rag",
    label: "Свои ИИ-агенты на RAG-базе",
    priceUsd: 26000,
    from: true,
    effect: "Модель на ваших данных и вашем сервере, без токенов сторонних агрегаторов",
    where: "integrations",
  },

  /* Продвижение — подписка */
  {
    id: "seo-12",
    label: "SEO-статьи на автопилоте · 12 в месяц",
    priceUsd: 380,
    monthly: true,
    exclusive: "seo",
    effect: "До 3 статей в неделю, индексация в Google, темы из поисковых запросов",
    where: "growth",
  },
  {
    id: "seo-20",
    label: "SEO-статьи на автопилоте · 20 в месяц",
    priceUsd: 550,
    monthly: true,
    exclusive: "seo",
    effect: "До 5 статей в неделю, индексация в Google, темы из поисковых запросов",
    where: "growth",
  },
  {
    id: "seo-40",
    label: "SEO-статьи на автопилоте · 40 в месяц",
    priceUsd: 750,
    monthly: true,
    exclusive: "seo",
    effect: "До 10 статей в неделю, индексация в Google, темы из поисковых запросов",
    where: "growth",
  },
  {
    id: "social",
    label: "Соцсети: автопостинг и ведение",
    priceUsd: 0,
    onRequest: true,
    effect: "Новости и объекты сами уходят в Telegram, Instagram и Facebook",
    where: "growth",
  },
];
