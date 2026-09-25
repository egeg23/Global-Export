import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Приём заявок сайта FOODMAXX.
 *
 * Отдельный обработчик, а не общий с соседями: у завода свои поля — город,
 * сеть, объём партии, — и всё это должно удаляться вместе с папкой
 * /foodmaxx, когда проект отыграет.
 */

type Lead = {
  name?: string;
  phone?: string;
  company?: string;
  city?: string;
  note?: string;
  page?: string;
  /** Ловушка: живой человек этого поля не видит. */
  website?: string;
};

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT = { windowMs: 60_000, max: 5 };
const OUTBOUND_TIMEOUT_MS = 8_000;

/** Счётчик по адресу: в памяти, одного процесса хватает против скрипта. */
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

/**
 * Отсекает посты с чужих сайтов: Origin сверяется с именем узла, на который
 * пришёл запрос. За обратным прокси в `request.url` внутренний адрес, поэтому
 * в сравнение идут ещё Host и X-Forwarded-Host — иначе своя же форма
 * получала бы отказ.
 */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const from = new URL(origin).host;
    const here = [
      new URL(request.url).host,
      request.headers.get("x-forwarded-host"),
      request.headers.get("host"),
    ];
    return here.some((host) => host === from);
  } catch {
    return false;
  }
}

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Телефон принимаем в любом написании, но цифр должно быть достаточно. */
const looksLikePhone = (value: string) => (value.match(/\d/g) ?? []).length >= 7;

async function sendToTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.FOODMAXX_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
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
    console.error("FOODMAXX: Telegram отказал", response.status);
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const size = Number(request.headers.get("content-length") ?? 0);
  if (size > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too-large" }, { status: 413 });
  }

  if (rateLimited(clientIp(request), Date.now())) {
    return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
  }

  let lead: Lead;
  try {
    lead = (await request.json()) as Lead;
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  // Ловушка заполнена — значит это робот. Отвечаем как обычно, чтобы он не
  // начал подбирать поля заново.
  if (clean(lead.website)) return NextResponse.json({ ok: true, delivered: false });

  const name = clean(lead.name, 120);
  const phone = clean(lead.phone, 40);
  if (!name || !looksLikePhone(phone)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const rows: [string, string][] = [
    ["Имя", name],
    ["Телефон", phone],
    ["Компания", clean(lead.company, 160)],
    ["Город", clean(lead.city, 80)],
    ["Комментарий", clean(lead.note, 1200)],
    ["Страница", clean(lead.page, 200)],
  ];

  const text = [
    "<b>Заявка с сайта FOODMAXX</b>",
    "",
    ...rows
      .filter(([, value]) => Boolean(value))
      .map(([label, value]) => `<b>${label}:</b> ${escapeHtml(value)}`),
  ].join("\n");

  let delivered = false;
  try {
    delivered = await sendToTelegram(text);
  } catch (error) {
    console.error("FOODMAXX: заявка не ушла", error);
  }

  if (!delivered) console.info("FOODMAXX: заявка без канала доставки\n" + text);

  return NextResponse.json({ ok: true, delivered });
}
