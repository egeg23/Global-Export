import { NextResponse } from "next/server";

import { sets } from "@/content/adar/catalog";
import { formatNumber } from "@/lib/adar/format";

export const runtime = "nodejs";

/**
 * Приём заявок витрины ADAR.
 *
 * Отдельный обработчик, а не общий с Global Export: у витрины свои поля,
 * свой язык и своя корзина, и всё это должно удаляться вместе с папкой
 * /adar, когда концепция отыграет.
 *
 * Состав заявки собирается здесь, из каталога, а не берётся из тела запроса:
 * цены и названия клиент подделать не должен.
 */

type OrderItem = { slug?: unknown; qty?: unknown };

type OrderPayload = {
  name?: string;
  phone?: string;
  company?: string;
  note?: string;
  count?: string;
  budget?: string;
  items?: OrderItem[];
  page?: string;
  /** Ловушка: живой человек этого поля не видит. */
  website?: string;
};

const TELEGRAM_LIMIT = 4096;
const MAX_BODY_BYTES = 32 * 1024;
const MAX_ITEMS = 80;
const MAX_QTY = 99_999;
const RATE_LIMIT = { windowMs: 60_000, max: 5 };
const OUTBOUND_TIMEOUT_MS = 8_000;

const catalog = new Map(sets.map((set) => [set.slug, set] as const));

/**
 * Счётчик по адресу. В памяти: сбивается при перезапуске и живёт в одном
 * процессе — этого хватает против скрипта, долбящего форму.
 */
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

/** Отсекает посты с чужих сайтов: у своей формы Origin совпадает. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function clean(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Телефон принимаем в любом написании, но цифр должно быть достаточно. */
function looksLikePhone(value: string): boolean {
  return (value.match(/\d/g) ?? []).length >= 7;
}

type Line = { name: string; qty: number; price: number; sum: number };

function resolveItems(items: OrderItem[] | undefined): Line[] {
  if (!Array.isArray(items)) return [];
  const lines: Line[] = [];
  for (const item of items.slice(0, MAX_ITEMS)) {
    const set = typeof item?.slug === "string" ? catalog.get(item.slug) : undefined;
    const qty = Number(item?.qty);
    if (!set || !Number.isFinite(qty) || qty <= 0) continue;
    const rounded = Math.min(MAX_QTY, Math.round(qty));
    lines.push({ name: set.name, qty: rounded, price: set.price, sum: set.price * rounded });
  }
  return lines;
}

async function sendToTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.ADAR_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(OUTBOUND_TIMEOUT_MS),
  });

  if (!response.ok) {
    console.error("ADAR: Telegram отказал", response.status);
    return false;
  }
  return true;
}

function buildMessage(order: OrderPayload, lines: Line[], total: number): string {
  const rows: [string, string | undefined][] = [
    ["Имя", order.name],
    ["Телефон", order.phone],
    ["Организация", order.company],
    ["Количество подарков", order.count],
    ["Бюджет на подарок", order.budget ? `${order.budget} сум` : ""],
    ["Страница", order.page],
  ];

  const head = [
    lines.length ? "<b>Заказ с сайта ADAR</b>" : "<b>Заявка с сайта ADAR</b>",
    "",
    ...rows
      .filter(([, value]) => Boolean(value))
      .map(([label, value]) => `<b>${label}:</b> ${escapeHtml(value as string)}`),
  ].join("\n");

  const basket = lines.length
    ? [
        "",
        "<b>Корзина</b>",
        ...lines.map(
          (line) =>
            `• ${escapeHtml(line.name)} × ${formatNumber(line.qty)} — ${formatNumber(line.sum)} сум`,
        ),
        `<b>Итого:</b> ${formatNumber(total)} сум`,
      ].join("\n")
    : "";

  const body = head + basket;
  if (!order.note) return body.slice(0, TELEGRAM_LIMIT);

  const prefix = `${body}\n\n<b>Комментарий:</b>\n`;
  const room = TELEGRAM_LIMIT - prefix.length - 1;
  if (room <= 0) return body.slice(0, TELEGRAM_LIMIT);
  // Экранирование удлиняет строку, поэтому режем уже после него.
  const escaped = escapeHtml(order.note);
  return prefix + (escaped.length > room ? `${escaped.slice(0, room - 1)}…` : escaped);
}

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

  let body: OrderPayload;
  try {
    body = JSON.parse(raw) as OrderPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Робот заполняет все поля, что находит; человек этого не видит.
  if (clean(body.website)) return NextResponse.json({ ok: true, delivered: false });

  const order: OrderPayload = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 60),
    company: clean(body.company, 160),
    note: clean(body.note, 3000),
    count: clean(body.count, 20),
    budget: clean(body.budget, 20),
    page: clean(body.page, 300),
  };

  if (!order.name || !order.phone || !looksLikePhone(order.phone)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const lines = resolveItems(body.items);
  const total = lines.reduce((sum, line) => sum + line.sum, 0);

  const delivered = await sendToTelegram(buildMessage(order, lines, total)).catch(() => false);

  if (!delivered) {
    // Без настроенного канала боевой сайт молча терял бы заявки, поэтому там
    // отвечаем ошибкой. Саму заявку в журнал не пишем: это личные данные.
    const demo = process.env.LEAD_ALLOW_UNCONFIGURED === "true";
    if (process.env.NODE_ENV === "production" && !demo) {
      console.error("ADAR: заявка принята, но канал доставки не настроен");
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
    }
    console.warn("[adar] канал доставки не настроен — заявка не отправлена");
  }

  return NextResponse.json({ ok: true, delivered, items: lines.length, total });
}
