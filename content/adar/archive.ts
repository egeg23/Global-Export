import type { ZodiacSign } from "@/components/adar/ui/zodiac-mark";

/**
 * Архив сезонов ADAR.
 *
 * Символ года считается по восточному календарю — это общеизвестное
 * правило, под него и делается новогодняя упаковка. А что именно компания
 * выпускала в каждый сезон, знает только она: обложки каталогов появятся
 * из её архива, поле `cover` для них уже есть. Список плоский и без
 * связей — его можно без переделок отдать в админку, чтобы заказчик
 * добавлял годы и обложки сам.
 */
export type ArchiveSeason = {
  year: number;
  sign: ZodiacSign;
  /** Символ года в родительном падеже: «год Кролика». */
  zodiac: string;
  /** Веха, о которой компания рассказывает сама. */
  note?: string;
  /** Обложка каталога за сезон — из архива заказчика. */
  cover?: string;
};

/** Двенадцатилетний круг. 1900, 1912, 1924… — годы Крысы, отсюда и отсчёт. */
const cycle: { sign: ZodiacSign; zodiac: string }[] = [
  { sign: "rat", zodiac: "Крысы" },
  { sign: "ox", zodiac: "Быка" },
  { sign: "tiger", zodiac: "Тигра" },
  { sign: "rabbit", zodiac: "Кролика" },
  { sign: "dragon", zodiac: "Дракона" },
  { sign: "snake", zodiac: "Змеи" },
  { sign: "horse", zodiac: "Лошади" },
  { sign: "goat", zodiac: "Козы" },
  { sign: "monkey", zodiac: "Обезьяны" },
  { sign: "rooster", zodiac: "Петуха" },
  { sign: "dog", zodiac: "Собаки" },
  { sign: "pig", zodiac: "Свиньи" },
];

const FIRST = 2008;
const LAST = 2026;

/** Только то, что компания публикует о себе сама. */
const notes: Record<number, string> = {
  2008: "Первый сезон",
  2011: "24 000 подарков Алмалыкскому комбинату",
  2026: "80 готовых наборов в каталоге",
};

export const seasons: ArchiveSeason[] = Array.from(
  { length: LAST - FIRST + 1 },
  (_, step) => {
    const year = FIRST + step;
    const { sign, zodiac } = cycle[(year - 4) % 12];
    return { year, sign, zodiac, note: notes[year] };
  },
);

/** Что повторяется из сезона в сезон — со слов самой компании. */
export const archiveSeasonsList = [
  "Новый год",
  "8 марта",
  "Детские наборы",
  "День защитника",
];
