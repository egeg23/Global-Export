import type { Metadata } from "next";

import { isShowcase } from "@/lib/showcase";

/**
 * Проекты витрины открыты поиску.
 *
 * Владелец, 29.09.2026: «сделай, чтобы все наши проекты индексировались в
 * поиске. Мы не будем конкурировать, не переживай». Витрина — публичное
 * портфолио студии: на неё ведут кейсы devuz.studio, и из поиска на неё
 * тоже должны приходить. Раньше её закрывали трижды — `noindex` в разметке,
 * `X-Robots-Tag` в прокси и в nginx, строки в robots.txt, — теперь на
 * площадке (`SHOWCASE_ROOT=true`) открыто всё, кроме панели Global Export
 * (`/admin`) и API.
 *
 * Без `SHOWCASE_ROOT` — то есть на боевом сайте, собранном из этого же
 * кода, — макеты чужих компаний и варианты, которые заказчик не выбрал,
 * по-прежнему закрыты: у компании один сайт, и чужой проект на её домене в
 * выдаче не нужен. Поэтому у проектов не «индексировать», а `projectRobots`.
 */
export const projectRobots: Metadata["robots"] = isShowcase
  ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
  : { index: false, follow: false, nocache: true };

/**
 * Страницы проектов для карты сайта площадки. Новый проект витрины — строка
 * здесь: без неё поисковик найдёт его только по ссылке с devuz.studio.
 * Панели управления в карту не входят — это не то, с чего стоит начинать
 * знакомство, — но и не закрыты. MAVERA, Golden House и Engelberg здесь
 * нет: они закрыты кодом доступа (lib/showcase/access.ts).
 */
export const SHOWCASE_PAGES: readonly { path: string; priority: number }[] = [
  { path: "/present", priority: 0.9 },
  { path: "/adar", priority: 0.9 },
  { path: "/adar/base", priority: 0.7 },
  { path: "/adar/plus", priority: 0.7 },
  { path: "/adar/premium", priority: 0.7 },
  { path: "/namuna", priority: 0.9 },
  { path: "/foodmaxx", priority: 0.9 },
  { path: "/foodmaxx/market", priority: 0.7 },
  { path: "/delta", priority: 0.9 },
  { path: "/akbar", priority: 0.9 },
  { path: "/akbar/katalog", priority: 0.7 },
  { path: "/tranio", priority: 0.9 },
  { path: "/ttc", priority: 0.9 },
  { path: "/comfort", priority: 0.9 },
  { path: "/comfort/a", priority: 0.7 },
  { path: "/comfort/b", priority: 0.7 },
  { path: "/medacademy", priority: 0.9 },
  { path: "/medacademy/a", priority: 0.7 },
  { path: "/medacademy/b", priority: 0.7 },
  { path: "/webname", priority: 0.9 },
  { path: "/webname/registry", priority: 0.8 },
  { path: "/webname/registry/domains", priority: 0.6 },
  { path: "/webname/registry/hosting", priority: 0.6 },
  { path: "/webname/premium", priority: 0.8 },
  { path: "/webname/premium/domains", priority: 0.6 },
  { path: "/webname/premium/hosting", priority: 0.6 },
];
