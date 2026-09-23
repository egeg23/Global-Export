import type { CatalogAddon, CatalogPage } from "@/lib/configurator/catalog";

/**
 * Услуги студии сверх сайта — одни на все проекты витрины.
 *
 * Это не блоки на макете, а работа рядом с ним: интеграции, ИИ-агенты,
 * статьи по подписке. Тумблер здесь ничего не показывает на странице —
 * только отмечает услугу для брифа. Группы помечены `virtual`, и док это
 * честно подписывает.
 *
 * Цен здесь нет: прайс студии — только на сервере,
 * в lib/configurator/prices.ts.
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
    effect: "Заявки и статусы ходят в вашу CRM по API в обе стороны",
    where: "integrations",
  },
  {
    id: "crm-own",
    label: "Своя CRM с контролем качества",
    effect: "Воронка, задачи, запись разговоров и оценка каждого диалога",
    where: "integrations",
  },
  {
    id: "ai-support",
    label: "ИИ-агенты на первую линию",
    effect: "Отвечают на сайте и в мессенджерах, квалифицируют и передают менеджеру",
    where: "integrations",
  },
  {
    id: "ai-rag",
    label: "Свои ИИ-агенты на RAG-базе",
    effect: "Модель на ваших данных и вашем сервере, без токенов сторонних агрегаторов",
    where: "integrations",
  },

  /* Продвижение — подписка */
  {
    id: "seo-12",
    label: "SEO-статьи на автопилоте · 12 в месяц",
    exclusive: "seo",
    effect: "До 3 статей в неделю, индексация в Google, темы из поисковых запросов",
    where: "growth",
  },
  {
    id: "seo-20",
    label: "SEO-статьи на автопилоте · 20 в месяц",
    exclusive: "seo",
    effect: "До 5 статей в неделю, индексация в Google, темы из поисковых запросов",
    where: "growth",
  },
  {
    id: "seo-40",
    label: "SEO-статьи на автопилоте · 40 в месяц",
    exclusive: "seo",
    effect: "До 10 статей в неделю, индексация в Google, темы из поисковых запросов",
    where: "growth",
  },
  {
    id: "social",
    label: "Соцсети: автопостинг и ведение",
    effect: "Новости и объекты сами уходят в Telegram, Instagram и Facebook",
    where: "growth",
  },
];
