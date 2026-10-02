/**
 * Оттенки площадки — шаг сборки стилей (postcss.config.mjs, после Tailwind).
 *
 * Каждый цвет, заданный переменной (`--color-adar-gold: #c9a45c`,
 * `--w-bg: #0b0d10`), сдвигается на 1–3 единицы по каждому каналу. Сдвиг свой
 * у каждой переменной и одинаков от сборки к сборке: он считается из имени
 * переменной и исходного цвета. Глаз разницы не видит, а страница,
 * скопированная с витрины через инструменты разработчика, пипеткой или
 * нейросетью, уносит ровно эти значения. Панель devuz.studio («Прототипы» →
 * «Проверить сайт») сверяет с ними чужой сайт — это раздел 6 условий
 * использования макетов (devuz.studio/ru/mockup-terms).
 *
 * Новый проект витрины ничего для этого не делает: его цвета в переменных
 * проходят тот же шаг. Цвета, написанные прямо в правилах, не трогаются.
 */
import { createHash } from "node:crypto";

const SALT = "globalex-tone-1";

const clamp = (v) => Math.min(255, Math.max(0, v));
const hex2 = (v) => v.toString(16).padStart(2, "0");

function hslToRgb(h, s, l) {
  const sat = s / 100;
  const light = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}

/**
 * Цвет из значения переменной — только если значение целиком один цвет.
 * `alpha` — как было записано (строкой), чтобы прозрачность не поменялась.
 */
export function parseColor(raw) {
  const value = String(raw).trim().toLowerCase();

  const hex = value.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (hex) {
    let h = hex[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join("");
    const rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    return { rgb, alpha: h.length === 8 ? h.slice(6) : null, form: "hex" };
  }

  const fn = value.match(/^(rgba?|hsla?)\(\s*([^)]*)\)$/);
  if (!fn) return null;
  const parts = fn[2].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3 || parts.length > 4) return null;
  const alpha = parts[3] ?? null;

  if (fn[1].startsWith("rgb")) {
    if (parts.slice(0, 3).some((p) => !/^\d+(\.\d+)?$/.test(p))) return null;
    return { rgb: parts.slice(0, 3).map((p) => clamp(Math.round(Number(p)))), alpha, form: "fn" };
  }
  const [h, s, l] = [parts[0].replace(/deg$/, ""), parts[1], parts[2]];
  if (!/^-?\d+(\.\d+)?$/.test(h) || !/^\d+(\.\d+)?%$/.test(s) || !/^\d+(\.\d+)?%$/.test(l)) return null;
  return { rgb: hslToRgb(((Number(h) % 360) + 360) % 360, parseFloat(s), parseFloat(l)), alpha, form: "fn" };
}

/**
 * Сдвиг для переменной: по каждому каналу ±1…3, не за пределами 0–255 и не
 * поровну во всех трёх — иначе серый остался бы серым и совпадал бы с
 * обычными #fdfdfd и #f5f5f5 на чужих сайтах.
 */
export function toneShift(name, rgb) {
  const h = createHash("sha256").update(`${SALT}|${name}|${rgb.join(",")}`).digest();
  const d = [0, 1, 2].map((i) => (1 + (h[i] % 3)) * (h[3 + i] & 1 ? 1 : -1));
  for (let i = 0; i < 3; i += 1) {
    if (rgb[i] + d[i] > 255 || rgb[i] + d[i] < 0) d[i] = -d[i];
  }
  if (d[0] === d[1] && d[1] === d[2]) {
    let alt = d[1] > 0 ? d[1] - 1 : d[1] + 1;
    if (alt === 0) alt = d[1] > 0 ? d[1] + 1 : d[1] - 1;
    if (rgb[1] + alt > 255 || rgb[1] + alt < 0) alt = -alt;
    d[1] = alt;
  }
  return rgb.map((v, i) => v + d[i]);
}

/** Новое значение переменной или null — если это не цвет. */
export function toneValue(name, value) {
  const color = parseColor(value);
  if (!color) return null;
  // Полностью прозрачный — не цвет, который кто-то увидит или унесёт.
  const alpha = color.alpha === null ? 1 : color.form === "hex" ? parseInt(color.alpha, 16) : parseFloat(color.alpha);
  if (alpha === 0) return null;
  const rgb = toneShift(name, color.rgb);
  if (color.alpha === null) return `#${rgb.map(hex2).join("")}`;
  if (color.form === "hex") return `#${rgb.map(hex2).join("")}${color.alpha}`;
  return `rgb(${rgb.join(" ")} / ${color.alpha})`;
}

/** Шаг сборки: каждая переменная с цветом получает свой сдвиг. */
const tone = () => ({
  postcssPlugin: "globalex-tone",
  OnceExit(root) {
    root.walkDecls(/^--/, (decl) => {
      const next = toneValue(decl.prop, decl.value);
      if (next) decl.value = next;
    });
  },
});
tone.postcss = true;

export default tone;
