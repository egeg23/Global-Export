import { NextResponse } from "next/server";

import { catalogOf } from "@/lib/configurator/catalogs";
import { priceCodeConfigured, priceCodeMatches } from "@/lib/configurator/price-code";
import { priceListFor } from "@/lib/configurator/prices";

export const runtime = "nodejs";

/**
 * Цены конструктора по коду.
 *
 * Решение владельца от 29.09.2026: цены студии на витрине показываются тому,
 * у кого есть код — его дают бот студии и менеджер (скаут). Браузер присылает
 * проект и код; сервер сверяет код (lib/configurator/price-code.ts) и только
 * тогда отдаёт прайс этого проекта. Без кода в ответе нет ни одной цифры.
 *
 * Код короткий, поэтому попыток мало: пять неверных в минуту с одного
 * адреса — и адрес ждёт до конца окна. Верный код счётчик не трогает.
 */

type Payload = { project?: unknown; code?: unknown };

const MAX_BODY_BYTES = 2 * 1024;
const WINDOW_MS = 60_000;
const MAX_FAILS = 5;

const fails = new Map<string, { count: number; resetAt: number }>();

function blocked(ip: string, now: number): boolean {
  const entry = fails.get(ip);
  return Boolean(entry && now <= entry.resetAt && entry.count >= MAX_FAILS);
}

function fail(ip: string, now: number) {
  const entry = fails.get(ip);
  if (!entry || now > entry.resetAt) {
    fails.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (fails.size > 5000) {
      for (const [key, value] of fails) if (now > value.resetAt) fails.delete(key);
    }
    return;
  }
  entry.count += 1;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Отсекает посты с чужих сайтов — как у брифа. */
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

function reply(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ ok: false, error: "forbidden" }, 403);

  const now = Date.now();
  const ip = clientIp(request);
  if (blocked(ip, now)) return reply({ ok: false, error: "too_many" }, 429);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply({ ok: false, error: "too_large" }, 413);

  let body: Payload;
  try {
    body = JSON.parse(raw) as Payload;
  } catch {
    return reply({ ok: false, error: "invalid_json" }, 400);
  }

  const catalog = catalogOf(typeof body.project === "string" ? body.project.slice(0, 40) : "");
  if (!catalog) return reply({ ok: false, error: "validation" }, 422);
  if (!priceCodeConfigured()) return reply({ ok: false, error: "not_configured" }, 503);

  const code = typeof body.code === "string" ? body.code : "";
  if (!priceCodeMatches(code)) {
    fail(ip, now);
    return reply({ ok: false, error: "wrong_code" }, 401);
  }

  const prices = priceListFor(catalog);
  if (!prices) return reply({ ok: false, error: "no_prices" }, 404);
  return reply({ ok: true, prices });
}
