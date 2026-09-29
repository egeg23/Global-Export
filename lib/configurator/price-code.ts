import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Код доступа к ценам студии на витрине.
 *
 * Решение владельца от 29.09.2026: цены в конструкторе показываются по коду.
 * Код клиенту дают бот студии или менеджер (скаут); он один на все проекты.
 *
 * Код живёт только в переменной `SHOWCASE_PRICE_CODE` в `.env.local` на
 * сервере — репозиторий публичный, и ни сам код, ни его хэш сюда не
 * попадают. Нет переменной — цены закрыты для всех: маршрут отвечает
 * «не настроено», а не открывается.
 *
 * Сравниваются хэши одинаковой длины через timingSafeEqual — по времени
 * ответа код не подобрать. От перебора защищает ограничение попыток в
 * маршруте; чем длиннее код, тем спокойнее.
 */

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Задан ли код на сервере. */
export function priceCodeConfigured(): boolean {
  return Boolean(process.env.SHOWCASE_PRICE_CODE?.trim());
}

export function priceCodeMatches(candidate: string): boolean {
  const configured = process.env.SHOWCASE_PRICE_CODE?.trim();
  const code = candidate.trim();
  if (!configured || !code || code.length > 64) return false;
  return timingSafeEqual(digest(code), digest(configured));
}
