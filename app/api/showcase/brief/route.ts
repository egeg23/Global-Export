import { NextResponse } from "next/server";

import { addonOf, isIncluded, tierOf, totalUsd as totalOf, type Catalog } from "@/lib/configurator/catalog";
import { catalogOf } from "@/lib/configurator/catalogs";

export const runtime = "nodejs";

/**
 * Бриф из конструктора.
 *
 * Клиент собрал сайт из пакета и допников и нажал «отправить». Из браузера
 * приходят только идентификаторы — пакет, список допников, контакт; цену и
 * названия сервер берёт из каталога сам: цифру в брифе подделать нельзя.
 *
 * Дальше два пути. Основной — студия: бриф уходит на devuz.studio, где
 * становится заявкой, попадает в Telegram (дороже порога — только
 * владельцу) и получает ссылку на бота, где ассистент закрывает первичку.
 * Запасной — если студия не настроена или не ответила: бриф уходит в
 * Telegram отсюда, по тому же правилу маршрутизации, но без ассистента.
 */

type Payload = {
  project?: unknown;
  tier?: unknown;
  addons?: unknown;
  name?: unknown;
  contact?: unknown;
  comment?: unknown;
  page?: unknown;
  share?: unknown;
  /** Ловушка: живой человек этого поля не видит. */
  website?: unknown;
};

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT = { windowMs: 60_000, max: 5 };
const STUDIO_TIMEOUT_MS = 25_000;
const TELEGRAM_TIMEOUT_MS = 8_000;
const TELEGRAM_LIMIT = 4096;

/** Порог «только владельцу» — тот же, что у студии. Строгое «больше». */
const OWNER_ONLY_FROM_USD = 10_000;

const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string, now: number): boolean {
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Отсекает посты с чужих сайтов — см. app/api/adar/order/route.ts. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const from = new URL(origin).host;
    const here = [new URL(request.url).host, request.headers.get("x-forwarded-host"), request.headers.get("host")];
    return here.some((host) => host === from);
  } catch {
    return false;
  }
}

function clean(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Контакт хоть какой-то: ник, семь цифр или почта. */
function looksLikeContact(value: string): boolean {
  if (/^@?[a-z0-9_]{4,}$/i.test(value)) return true;
  if ((value.match(/\d/g) ?? []).length >= 7) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function fmt(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

type Order = {
  catalog: Catalog;
  tier: { id: string; label: string; priceUsd: number };
  addons: { id: string; label: string; priceUsd: number; included: boolean }[];
  totalUsd: number;
  name: string;
  contact: string;
  comment: string;
  page: string;
  share: string;
};

/* ------------------------------------------------------------------ */
/* Основной путь: студия                                               */
/* ------------------------------------------------------------------ */

async function sendToStudio(
  order: Order,
): Promise<{ requestNo?: string; botUrl?: string; delivered: boolean } | null> {
  const secret = process.env.SHOWCASE_BRIEF_SECRET;
  if (!secret) return null;
  const url = process.env.SHOWCASE_BRIEF_URL || "https://devuz.studio/api/brief";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-brief-secret": secret },
      body: JSON.stringify({
        project: order.catalog.project,
        projectLabel: order.catalog.label,
        niche: order.catalog.niche,
        nicheTier: order.catalog.nicheTier,
        tier: order.tier,
        addons: order.addons,
        totalUsd: order.totalUsd,
        name: order.name,
        contact: order.contact,
        comment: order.comment,
        locale: "ru",
        pageUrl: order.page,
        shareUrl: order.share,
      }),
      signal: AbortSignal.timeout(STUDIO_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error("showcase brief: студия ответила", response.status);
      return null;
    }
    const json = (await response.json()) as { ok?: boolean; requestNo?: string; botUrl?: string; delivered?: boolean };
    if (!json.ok) return null;
    return { requestNo: json.requestNo, botUrl: json.botUrl, delivered: json.delivered === true };
  } catch (error) {
    console.error("showcase brief: студия недоступна", error);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Запасной путь: Telegram отсюда                                      */
/* ------------------------------------------------------------------ */

function buildMessage(order: Order, ownerOnly: boolean, fallback: boolean): string {
  const paid = order.addons.filter((addon) => !addon.included && addon.priceUsd > 0);
  const free = order.addons.filter((addon) => addon.included || addon.priceUsd === 0);
  const rows: [string, string][] = [
    ["Имя", order.name],
    ["Контакт", order.contact],
    ["Страница", order.page],
  ];

  const lines = [
    `🧩 <b>БРИФ С ВИТРИНЫ</b> · ${escapeHtml(order.catalog.label)} · <b>$${fmt(order.totalUsd)}</b>`,
    ownerOnly && !fallback ? `🔒 Только владельцу: заказ дороже $${fmt(OWNER_ONLY_FROM_USD)}` : "",
    fallback
      ? `⚠️ Заказ дороже $${fmt(OWNER_ONLY_FROM_USD)}, а чат владельца не задан (SHOWCASE_OWNER_CHAT_ID) — бриф ушёл сюда.`
      : "",
    "",
    `📦 Пакет «${escapeHtml(order.tier.label)}» — $${fmt(order.tier.priceUsd)}`,
    ...paid.map((addon) => `➕ ${escapeHtml(addon.label)} — +$${fmt(addon.priceUsd)}`),
    free.length ? `✔️ В пакете: ${free.map((addon) => escapeHtml(addon.label)).join(", ")}` : "",
    `<b>Итого: $${fmt(order.totalUsd)}</b>`,
    "",
    ...rows.filter(([, value]) => Boolean(value)).map(([label, value]) => `<b>${label}:</b> ${escapeHtml(value)}`),
    order.share ? `🔗 <a href="${escapeHtml(order.share)}">Открыть набор на витрине</a>` : "",
    "",
    "<i>Ассистент студии не подключён: бриф отправлен напрямую с витрины.</i>",
  ].filter((line, index, all) => line !== "" || all[index - 1] !== "");

  const body = lines.join("\n");
  if (!order.comment) return body.slice(0, TELEGRAM_LIMIT);

  const prefix = `${body}\n\n<b>Комментарий:</b>\n`;
  const room = TELEGRAM_LIMIT - prefix.length - 1;
  if (room <= 0) return body.slice(0, TELEGRAM_LIMIT);
  const escaped = escapeHtml(order.comment);
  return prefix + (escaped.length > room ? `${escaped.slice(0, room - 1)}…` : escaped);
}

async function sendToTelegram(order: Order): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const sales = process.env.TELEGRAM_CHAT_ID;
  const owner = process.env.SHOWCASE_OWNER_CHAT_ID;
  if (!token) return false;

  const ownerOnly = order.totalUsd > OWNER_ONLY_FROM_USD;
  const fallback = ownerOnly && !owner;
  if (fallback) console.error("showcase brief: заказ дороже порога, а SHOWCASE_OWNER_CHAT_ID не задан");
  const chatId = ownerOnly && owner ? owner : sales;
  if (!chatId) return false;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildMessage(order, ownerOnly, fallback),
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
    }),
    signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
  });

  if (!response.ok) {
    console.error("showcase brief: Telegram отказал", response.status);
    return false;
  }
  return true;
}

/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }
  if (rateLimited(clientIp(request), Date.now())) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let body: Payload;
  try {
    body = JSON.parse(raw) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (clean(body.website)) return NextResponse.json({ ok: true, delivered: false });

  const catalog = catalogOf(clean(body.project, 40));
  const tierId = clean(body.tier, 40);
  const contact = clean(body.contact, 200);
  if (!catalog || !catalog.tiers.some((tier) => tier.id === tierId) || !looksLikeContact(contact)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  // Набор — только известные допники, в порядке каталога, без повторов.
  const known = new Set(catalog.addons.map((addon) => addon.id));
  const requested = new Set(
    (Array.isArray(body.addons) ? body.addons : []).filter((id): id is string => typeof id === "string" && known.has(id)),
  );
  const tier = tierOf(catalog, tierId);

  const order: Order = {
    catalog,
    tier: { id: tier.id, label: tier.label, priceUsd: tier.priceUsd },
    addons: catalog.addons
      .filter((addon) => requested.has(addon.id))
      .map((addon) => ({
        id: addon.id,
        label: addonOf(catalog, addon.id).label,
        priceUsd: addon.priceUsd,
        included: isIncluded(catalog, tier.id, addon.id),
      })),
    totalUsd: totalOf(catalog, tier.id, requested),
    name: clean(body.name, 120),
    contact,
    comment: clean(body.comment, 1500),
    page: clean(body.page, 500),
    share: clean(body.share, 1000),
  };

  const studio = await sendToStudio(order);
  if (studio) {
    return NextResponse.json({
      ok: true,
      via: "studio",
      requestNo: studio.requestNo,
      botUrl: studio.botUrl,
      delivered: studio.delivered,
      totalUsd: order.totalUsd,
    });
  }

  const delivered = await sendToTelegram(order).catch((error) => {
    console.error("showcase brief: Telegram", error);
    return false;
  });

  if (!delivered) {
    const demo = process.env.LEAD_ALLOW_UNCONFIGURED === "true";
    if (process.env.NODE_ENV === "production" && !demo) {
      console.error("showcase brief: принят, но ни студия, ни Telegram не настроены");
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
    }
    console.warn("[showcase brief] канал доставки не настроен — бриф не отправлен");
  }

  return NextResponse.json({ ok: true, via: "telegram", delivered, totalUsd: order.totalUsd });
}
