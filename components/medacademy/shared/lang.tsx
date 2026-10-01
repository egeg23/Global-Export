"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { Addon, useAddon } from "@/components/configurator/context";
import { cn } from "@/lib/cn";

/**
 * Языки — допники «Узбекская версия» и «Английская версия».
 *
 * В макете переводятся шапка и первый экран: этого хватает, чтобы увидеть,
 * как работает переключатель. Полный перевод — часть допника. Выключил
 * тумблер — страница сама возвращается на русский.
 */

export type Lang = "ru" | "uz" | "en";

type Dict = Record<string, string>;

export const DICT: Record<Lang, Dict> = {
  ru: {
    courses: "Курсы",
    teachers: "Преподаватели",
    score: "Балл DTM",
    contacts: "Контакты",
    cta: "Записаться",
    aTitle: "Поступить в медицинский — по системе.",
    aSub: "Курсы биологии и химии в центре Ташкента. Ведут выпускники ТМА, поступившие с баллами 180,5 и 179,2 из 189.",
    bTitle: "Химия + биология = медвуз",
    bSub: "350+ выпускников MedAcademy стали студентами медвузов. Следующий — ты.",
    tag: "Подготовка к поступлению в медицинские вузы",
  },
  uz: {
    courses: "Kurslar",
    teachers: "O‘qituvchilar",
    score: "DTM bali",
    contacts: "Aloqa",
    cta: "Kursga yozilish",
    aTitle: "Tibbiyot oliygohiga — tizim bilan.",
    aSub: "Toshkent markazida biologiya va kimyo kurslari. Darslarni 189 dan 180,5 va 179,2 ball bilan o‘qishga kirgan TTA bitiruvchilari olib boradi.",
    bTitle: "Kimyo + biologiya = tibbiyot oliygohi",
    bSub: "MedAcademy’ning 350+ bitiruvchisi tibbiyot oliygohlari talabasi bo‘ldi. Navbat — senga.",
    tag: "Tibbiyot oliygohlariga kirishga tayyorlov",
  },
  en: {
    courses: "Courses",
    teachers: "Teachers",
    score: "DTM score",
    contacts: "Contacts",
    cta: "Enrol",
    aTitle: "Into medical school — by system.",
    aSub: "Biology and chemistry courses in central Tashkent, taught by Tashkent Medical Academy graduates who scored 180.5 and 179.2 out of 189.",
    bTitle: "Chemistry + biology = med school",
    bSub: "350+ MedAcademy graduates are now medical students. You’re next.",
    tag: "Preparing applicants for medical universities",
  },
};

const Ctx = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({ lang: "ru", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ru");
  const uz = useAddon("uz");
  const en = useAddon("en");
  const active: Lang = (lang === "uz" && !uz) || (lang === "en" && !en) ? "ru" : lang;

  useEffect(() => {
    document.documentElement.lang = active;
  }, [active]);

  return <Ctx.Provider value={{ lang: active, setLang }}>{children}</Ctx.Provider>;
}

/** Строка интерфейса на текущем языке. */
export function useT() {
  const { lang } = useContext(Ctx);
  return (key: keyof (typeof DICT)["ru"]) => DICT[lang][key] ?? DICT.ru[key];
}

/** Пилюли языков в шапке: RU всегда, UZ и EN — блоки допников. */
export function LangPills({ className, pill }: { className?: string; pill: string }) {
  const { lang, setLang } = useContext(Ctx);
  const button = (code: Lang) => (
    <button
      type="button"
      aria-pressed={lang === code}
      onClick={() => setLang(code)}
      className={cn(pill, "min-h-11 min-w-11 px-2 text-xs font-bold uppercase tracking-wider")}
    >
      {code}
    </button>
  );
  return (
    <span className={cn("inline-flex min-w-0 flex-wrap items-center justify-end gap-1", className)} role="group" aria-label="Язык сайта">
      {button("ru")}
      <Addon id="uz" inline scroll={false} className="max-w-[10rem] sm:max-w-none">
        {button("uz")}
      </Addon>
      <Addon id="en" inline scroll={false} className="max-w-[10rem] sm:max-w-none">
        {button("en")}
      </Addon>
    </span>
  );
}
