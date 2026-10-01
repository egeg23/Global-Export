/**
 * Балл DTM (UZBMB) для медицинских направлений.
 *
 * 90 вопросов, максимум 189: обязательные — родной язык, математика,
 * история Узбекистана — по 10 вопросов × 1,1; первый профильный предмет
 * (биология) — 30 × 3,1; второй (химия) — 30 × 2,1. Источники — в
 * docs/medacademy-research.md (oliygoh.uz, infoedu.uz, ustabor.uz).
 *
 * Национальный сертификат засчитывается вместо теста по предмету. Таблица
 * «уровень → балл» — ориентир testmakon.uz по нижней границе уровня; на
 * странице это подписано, а точную формулу перед запуском надо сверить
 * с UZBMB.
 */

export const DTM = {
  mandatory: { questions: 30, weight: 1.1 },
  bio: { questions: 30, weight: 3.1 },
  chem: { questions: 30, weight: 2.1 },
  max: 189,
} as const;

export type CertLevel = "none" | "A+" | "A" | "B+" | "B" | "C+" | "C";

export const CERT_LEVELS: CertLevel[] = ["none", "A+", "A", "B+", "B", "C+", "C"];

const CERT_POINTS: Record<Exclude<CertLevel, "none">, { bio: number; chem: number }> = {
  "A+": { bio: 93, chem: 63 },
  A: { bio: 93, chem: 63 },
  "B+": { bio: 85.9, chem: 58.2 },
  B: { bio: 78.7, chem: 53.3 },
  "C+": { bio: 71.5, chem: 48.5 },
  C: { bio: 65.8, chem: 44.6 },
};

export type DtmInput = { mandatory: number; bio: number; chem: number; bioCert: CertLevel; chemCert: CertLevel };

export function dtmParts(input: DtmInput) {
  const mandatory = round(input.mandatory * DTM.mandatory.weight);
  const bio = input.bioCert !== "none" ? CERT_POINTS[input.bioCert].bio : round(input.bio * DTM.bio.weight);
  const chem = input.chemCert !== "none" ? CERT_POINTS[input.chemCert].chem : round(input.chem * DTM.chem.weight);
  return { mandatory, bio, chem, total: round(mandatory + bio + chem) };
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

/** Ориентиры — баллы преподавателей при поступлении, с их сайта. */
export const MARKS = [
  { name: "Азамат Исламбеков", verb: "поступил", score: 180.5 },
  { name: "Рашид Валиулин", verb: "поступил", score: 179.2 },
  { name: "Самира Рахматова", verb: "поступила", score: 164.7 },
];

export function fmt(value: number) {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: 1 });
}
