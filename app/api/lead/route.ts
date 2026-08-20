import { NextResponse } from "next/server";

import { siteUrl } from "@/lib/seo";

export const runtime = "nodejs";

type LeadPayload = {
  name?: string;
  company?: string;
  country?: string;
  email?: string;
  phone?: string;
  product?: string;
  volume?: string;
  message?: string;
  locale?: string;
  page?: string;
  /** Honeypot — real users never fill this. */
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Telegram rejects anything longer than this. */
const TELEGRAM_LIMIT = 4096;

/** Refuse oversized bodies before parsing them. */
const MAX_BODY_BYTES = 16 * 1024;

const RATE_LIMIT = { windowMs: 60_000, max: 5 };
const OUTBOUND_TIMEOUT_MS = 8_000;

/**
 * Per-IP counter. In-memory, so it resets on redeploy and is per-instance —
 * enough to blunt a script hammering the form, not a substitute for a WAF.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string, now: number): boolean {
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    // Opportunistic cleanup so the map cannot grow without bound.
    if (hits.size > 5000) {
      for (const [key, value] of hits) {
        if (now > value.resetAt) hits.delete(key);
      }
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

/** Rejects cross-site posts; same-origin requests carry a matching Origin. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Non-browser clients omit it entirely.

  try {
    const host = new URL(origin).host;
    return host === new URL(request.url).host || host === new URL(siteUrl).host;
  } catch {
    return false;
  }
}

function clean(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function post(url: string, body: unknown): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(OUTBOUND_TIMEOUT_MS),
  });
}

async function sendToTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const response = await post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  if (!response.ok) {
    console.error("Telegram delivery failed", response.status);
    return false;
  }
  return true;
}

/**
 * Optional Bitrix24 hand-off. Set BITRIX_WEBHOOK_URL to an inbound webhook
 * (…/rest/1/<token>/) and every lead is also created as a CRM lead.
 */
async function sendToBitrix(lead: LeadPayload): Promise<boolean> {
  const base = process.env.BITRIX_WEBHOOK_URL;
  if (!base) return false;

  const fields: Record<string, unknown> = {
    TITLE: `Website enquiry — ${lead.name || "no name"}${lead.company ? ` (${lead.company})` : ""}`,
    NAME: lead.name,
    COMPANY_TITLE: lead.company,
    COMMENTS: [
      lead.product ? `Product: ${lead.product}` : "",
      lead.volume ? `Volume: ${lead.volume}` : "",
      lead.country ? `Country: ${lead.country}` : "",
      lead.message,
      lead.page ? `Page: ${lead.page}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    SOURCE_DESCRIPTION: `globalex.uz (${lead.locale ?? "en"})`,
  };
  if (lead.email) fields.EMAIL = [{ VALUE: lead.email, VALUE_TYPE: "WORK" }];
  if (lead.phone) fields.PHONE = [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }];

  const response = await post(`${base.replace(/\/$/, "")}/crm.lead.add.json`, {
    fields,
    params: { REGISTER_SONET_EVENT: "Y" },
  });

  if (!response.ok) {
    console.error("Bitrix delivery failed", response.status);
    return false;
  }
  return true;
}

/** Builds the notification, trimming the free-text field to fit Telegram. */
function buildMessage(lead: LeadPayload): string {
  const rows: [string, string | undefined][] = [
    ["Name", lead.name],
    ["Company", lead.company],
    ["Country", lead.country],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Product", lead.product],
    ["Volume", lead.volume],
    ["Language", lead.locale],
    ["Page", lead.page],
  ];

  const header = [
    "<b>New enquiry — globalex.uz</b>",
    "",
    ...rows
      .filter(([, value]) => Boolean(value))
      .map(([label, value]) => `<b>${label}:</b> ${escapeHtml(value as string)}`),
  ].join("\n");

  if (!lead.message) return header;

  const prefix = `${header}\n\n<b>Message:</b>\n`;
  const room = TELEGRAM_LIMIT - prefix.length - 1;
  const escaped = escapeHtml(lead.message);
  // Escaping can more than double the length, so trim after escaping.
  return prefix + (escaped.length > room ? `${escaped.slice(0, Math.max(room - 1, 0))}…` : escaped);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  if (rateLimited(clientIp(request), Date.now())) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let body: LeadPayload;
  try {
    body = JSON.parse(raw) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Bots fill every field they find; humans never see this one.
  if (clean(body.website)) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const lead: LeadPayload = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    country: clean(body.country, 80),
    email: clean(body.email, 160),
    phone: clean(body.phone, 60),
    product: clean(body.product, 160),
    volume: clean(body.volume, 120),
    message: clean(body.message, 3000),
    locale: clean(body.locale, 5),
    page: clean(body.page, 300),
  };

  if (!lead.name || !lead.email || !EMAIL_RE.test(lead.email)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const [telegram, bitrix] = await Promise.all([
    sendToTelegram(buildMessage(lead)).catch(() => false),
    sendToBitrix(lead).catch(() => false),
  ]);

  const delivered = telegram || bitrix;

  if (!delivered) {
    // Without a configured channel a production deploy would silently drop the
    // lead, so fail loudly there — unless this is a demo deployment that has
    // opted in. Never log the payload itself: it is personal data, and
    // application logs are not the place for it.
    const demoMode = process.env.LEAD_ALLOW_UNCONFIGURED === "true";

    if (process.env.NODE_ENV === "production" && !demoMode) {
      console.error("Lead received but no delivery channel is configured");
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
    }
    console.warn("[lead] no delivery channel configured — enquiry not delivered");
  }

  return NextResponse.json({ ok: true, delivered });
}
