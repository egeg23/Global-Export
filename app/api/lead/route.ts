import { NextResponse } from "next/server";

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

function clean(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function sendToTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
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
  });

  if (!response.ok) {
    console.error("Telegram delivery failed", response.status, await response.text());
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

  const url = `${base.replace(/\/$/, "")}/crm.lead.add.json`;
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

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields, params: { REGISTER_SONET_EVENT: "Y" } }),
  });

  if (!response.ok) {
    console.error("Bitrix delivery failed", response.status, await response.text());
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
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

  const text = [
    "<b>New enquiry — globalex.uz</b>",
    "",
    ...rows
      .filter(([, value]) => Boolean(value))
      .map(([label, value]) => `<b>${label}:</b> ${escapeHtml(value as string)}`),
    lead.message ? `\n<b>Message:</b>\n${escapeHtml(lead.message)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const [telegram, bitrix] = await Promise.all([
    sendToTelegram(text).catch(() => false),
    sendToBitrix(lead).catch(() => false),
  ]);

  const delivered = telegram || bitrix;

  if (!delivered) {
    // Without a configured channel a production deploy would silently drop the
    // lead, so fail loudly there; in development the payload is just logged.
    if (process.env.NODE_ENV === "production") {
      console.error("Lead received but no delivery channel is configured", lead);
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
    }
    console.warn("[lead] no delivery channel configured — payload:", lead);
  }

  return NextResponse.json({ ok: true, delivered });
}
