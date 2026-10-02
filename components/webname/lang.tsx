"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useAddon } from "@/components/configurator/context";
import { cn } from "@/lib/cn";

/**
 * Языки — допники конструктора. Русский есть всегда, узбекский и английский
 * появляются тумблерами. На макете переводятся шапка и первый экран: этого
 * достаточно, чтобы заказчик увидел, как работает переключатель.
 * «Tekshirish» — их же подпись кнопки на узбекской версии webname.uz.
 */
export type Lang = "ru" | "uz" | "en";

const DICT = {
  domains: { ru: "Домены", uz: "Domenlar", en: "Domains" },
  hosting: { ru: "Хостинг", uz: "Hosting", en: "Hosting" },
  ssl: { ru: "SSL", uz: "SSL", en: "SSL" },
  transfer: { ru: "Перенос", uz: "Ko‘chirish", en: "Transfer" },
  contacts: { ru: "Контакты", uz: "Aloqa", en: "Contacts" },
  cabinet: { ru: "Кабинет", uz: "Kabinet", en: "Account" },
  check: { ru: "Проверить", uz: "Tekshirish", en: "Check" },
  heroTitle: { ru: "Займите своё имя в .UZ", uz: "O‘z nomingizni .UZ da band qiling", en: "Claim your name in .UZ" },
  heroSub: {
    ru: "Аккредитованный регистратор зоны .UZ, хостинг в сумах, SSL и сайты под ключ. Наберите имя — покажем, где оно свободно.",
    uz: ".UZ zonasining akkreditatsiyalangan registratori, so‘mdagi hosting, SSL va tayyor saytlar. Nomni yozing — qayerda bo‘shligini ko‘rsatamiz.",
    en: "An accredited .UZ registrar with hosting priced in sum, SSL and turnkey websites. Type a name and see where it is free.",
  },
  placeholder: { ru: "ваше-имя", uz: "sizning-nomingiz", en: "your-name" },
  write: { ru: "Написать в Telegram", uz: "Telegramga yozish", en: "Message on Telegram" },
} as const;

export type Key = keyof typeof DICT;

const Ctx = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({ lang: "ru", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ru");
  const uz = useAddon("uz");
  const en = useAddon("en");
  // Выключили язык в доке — страница возвращается на русский.
  const active: Lang = (lang === "uz" && !uz) || (lang === "en" && !en) ? "ru" : lang;

  useEffect(() => {
    document.documentElement.lang = active === "uz" ? "uz" : active;
  }, [active]);

  return <Ctx.Provider value={{ lang: active, setLang }}>{children}</Ctx.Provider>;
}

export function useT() {
  const { lang } = useContext(Ctx);
  return (key: Key) => DICT[key][lang];
}

/**
 * Пилюли языков. Узбекская и английская появляются, когда их включили в
 * доке, — без «призрака» в шапке: на телефоне ему там не хватило бы места.
 */
export function LangPills({ className }: { className?: string }) {
  const { lang, setLang } = useContext(Ctx);
  const uz = useAddon("uz");
  const en = useAddon("en");
  const pill = (id: Lang, label: string) => (
    <button
      type="button"
      aria-pressed={lang === id}
      onClick={() => setLang(id)}
      className={cn(
        "wn-mono min-h-11 min-w-11 rounded-lg px-2 text-xs font-bold transition-colors",
        lang === id ? "text-wn-ink ring-1 ring-wn-ink" : "text-wn-ink-2 hover:text-wn-ink",
      )}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label="Язык" className={cn("flex items-center gap-0.5", className)}>
      {pill("ru", "RU")}
      {uz ? <span className="wn-pop">{pill("uz", "UZ")}</span> : null}
      {en ? <span className="wn-pop">{pill("en", "EN")}</span> : null}
    </div>
  );
}
