import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Двенадцать знаков восточного календаря. */
export type ZodiacSign =
  | "rat"
  | "ox"
  | "tiger"
  | "rabbit"
  | "dragon"
  | "snake"
  | "horse"
  | "goat"
  | "monkey"
  | "rooster"
  | "dog"
  | "pig";

/**
 * Знаки нарисованы здесь, а не взяты эмодзи: эмодзи на маке, на винде и на
 * телефоне выглядят по-разному и рядом с золотым тиснением смотрятся
 * чужеродно. Здесь один штрих, одна сетка 64×64 и цвет от родителя —
 * знак ведёт себя как буква.
 */
const marks: Record<ZodiacSign, ReactNode> = {
  rat: (
    <>
      <circle cx="20" cy="19" r="8"/><circle cx="44" cy="19" r="8"/>
    <path d="M15 26c-2 9 2 18 9 23l8 6 8-6c7-5 11-14 9-23"/>
    <circle cx="32" cy="46" r="1.8" fill="currentColor" stroke="none"/>
    <circle cx="26" cy="35" r="1.6" fill="currentColor" stroke="none"/><circle cx="38" cy="35" r="1.6" fill="currentColor" stroke="none"/>
    <path d="M27 49l-11 2M27 52l-10 5M37 49l11 2M37 52l10 5"/>
    </>
  ),
  ox: (
    <>
      <path d="M23 26C15 20 8 20 4 25"/><path d="M41 26c8-6 15-6 19-1"/>
    <path d="M4 25c1 5 5 8 10 9"/><path d="M60 25c-1 5-5 8-10 9"/>
    <path d="M23 25c-2 12 1 22 9 28 8-6 11-16 9-28"/>
    <circle cx="27" cy="33" r="1.7" fill="currentColor" stroke="none"/><circle cx="37" cy="33" r="1.7" fill="currentColor" stroke="none"/>
    <path d="M26 44c2 5 10 5 12 0"/>
    <circle cx="30" cy="46" r="1.3" fill="currentColor" stroke="none"/><circle cx="34" cy="46" r="1.3" fill="currentColor" stroke="none"/>
    </>
  ),
  tiger: (
    <>
      <path d="M16 24c-2-10 2-14 8-12"/><path d="M48 24c2-10-2-14-8-12"/>
    <path d="M20 20c-6 10-5 22 4 29 3 2 6 3 8 3s5-1 8-3c9-7 10-19 4-29"/>
    <path d="M24 22l2 7M32 20v8M40 22l-2 7"/>
    <circle cx="25" cy="36" r="1.7" fill="currentColor" stroke="none"/><circle cx="39" cy="36" r="1.7" fill="currentColor" stroke="none"/>
    <path d="M32 41v3M27 46c3 3 7 3 10 0"/>
    <path d="M18 42l-7 2M46 42l7 2"/>
    </>
  ),
  rabbit: (
    <>
      <path d="M24 30c-4-8-6-17-4-23 5-1 9 6 11 15"/><path d="M40 30c4-8 6-17 4-23-5-1-9 6-11 15"/>
    <path d="M20 34c-2 10 3 19 12 19s14-9 12-19"/>
    <circle cx="27" cy="41" r="1.6" fill="currentColor" stroke="none"/><circle cx="37" cy="41" r="1.6" fill="currentColor" stroke="none"/>
    <path d="M32 46v3M28 51c2 2 6 2 8 0"/>
    </>
  ),
  dragon: (
    <>
      <path d="M24 21C20 11 14 6 8 8c6 4 10 8 12 14"/><path d="M40 21c4-10 10-15 16-13-6 4-10 8-12 14"/>
    <path d="M22 25c-4 10 0 21 10 27 10-6 14-17 10-27"/>
    <path d="M22 25c4-4 16-4 20 0"/>
    <circle cx="27" cy="31" r="1.7" fill="currentColor" stroke="none"/><circle cx="37" cy="31" r="1.7" fill="currentColor" stroke="none"/>
    <path d="M27 41c3 3 7 3 10 0"/>
    <path d="M22 35c-8 2-12 8-11 16"/><path d="M42 35c8 2 12 8 11 16"/>
    </>
  ),
  snake: (
    <>
      <path d="M38 17C22 15 11 25 13 37c2 12 17 18 28 11 9-6 9-17 1-22-6-4-14-1-14 5 0 5 6 8 10 5"/>
    <circle cx="40" cy="15" r="4"/>
    <circle cx="41" cy="14" r="1.4" fill="currentColor" stroke="none"/>
    <path d="M44 13l6-2M50 11l-4-2M50 11l-1 4"/>
    </>
  ),
  horse: (
    <>
      <path d="M48 58c2-18-3-31-13-37-6-4-15-4-20 1-5 5-5 11 0 14 4 2 9 2 13 1 4 5 5 13 4 21z"/>
    <path d="M34 21l3-12 7 10"/>
    <path d="M40 19c8 5 12 17 10 29"/>
    <circle cx="23" cy="28" r="1.7" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="32" r="1.3" fill="currentColor" stroke="none"/>
    </>
  ),
  goat: (
    <>
      <path d="M24 24c-3-9-11-13-17-9 6 3 11 9 13 16"/><path d="M40 24c3-9 11-13 17-9-6 3-11 9-13 16"/>
    <path d="M22 26c-2 11 2 20 10 26 8-6 12-15 10-26"/>
    <circle cx="27" cy="34" r="1.6" fill="currentColor" stroke="none"/><circle cx="37" cy="34" r="1.6" fill="currentColor" stroke="none"/>
    <path d="M29 45c2 2 4 2 6 0"/>
    <path d="M29 53c1 6 5 6 6 0"/>
    </>
  ),
  monkey: (
    <>
      <circle cx="16" cy="30" r="7"/><circle cx="48" cy="30" r="7"/>
    <path d="M22 22c-3 10-2 20 4 26 3 3 4 4 6 4s3-1 6-4c6-6 7-16 4-26"/>
    <path d="M24 34c3-4 13-4 16 0 3 4 2 12-8 12s-11-8-8-12z"/>
    <circle cx="28" cy="30" r="1.5" fill="currentColor" stroke="none"/><circle cx="36" cy="30" r="1.5" fill="currentColor" stroke="none"/>
    </>
  ),
  rooster: (
    <>
      <path d="M26 22c-2-5 1-9 4-8 1-4 6-5 8-1 4-1 6 3 4 6"/>
    <path d="M26 22c-6 3-9 9-9 16 0 10 7 17 16 17"/>
    <path d="M42 19c5 4 8 11 8 18 0 5-2 10-5 13"/>
    <path d="M50 30l8 3-8 3"/>
    <circle cx="44" cy="28" r="1.6" fill="currentColor" stroke="none"/>
    <path d="M40 40c2 5 1 9-2 11"/>
    </>
  ),
  dog: (
    <>
      <path d="M19 21c-8 2-11 13-7 21 4 5 8 3 9-2"/><path d="M45 21c8 2 11 13 7 21-4 5-8 3-9-2"/>
    <path d="M20 22c-2 11 0 21 6 26 2 2 4 3 6 3s4-1 6-3c6-5 8-15 6-26-4-4-8-6-12-6s-8 2-12 6"/>
    <circle cx="26" cy="32" r="1.7" fill="currentColor" stroke="none"/><circle cx="38" cy="32" r="1.7" fill="currentColor" stroke="none"/>
    <path d="M32 39v3M28 45c2 2 6 2 8 0"/>
    </>
  ),
  pig: (
    <>
      <path d="M16 22l2 8M48 22l-2 8"/>
    <path d="M18 24c-4 10-2 21 6 27 3 2 6 3 8 3s5-1 8-3c8-6 10-17 6-27"/>
    <ellipse cx="32" cy="42" rx="9" ry="7"/>
    <circle cx="29" cy="42" r="1.5" fill="currentColor" stroke="none"/><circle cx="35" cy="42" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="24" cy="31" r="1.5" fill="currentColor" stroke="none"/><circle cx="40" cy="31" r="1.5" fill="currentColor" stroke="none"/>
    </>
  ),
};

export function ZodiacMark({
  sign,
  className,
  title,
}: {
  sign: ZodiacSign;
  className?: string;
  /** Если знак несёт смысл сам по себе, а не идёт рядом с подписью. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : "true"}
      aria-label={title}
      className={cn("block", className)}
    >
      {marks[sign]}
    </svg>
  );
}
