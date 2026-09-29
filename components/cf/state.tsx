"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { useAddon } from "@/components/configurator/context";

/**
 * Состояние сайта Comfort, общее для блоков: язык, избранное, сравнение и
 * выбранная для рассрочки модель. Обычное состояние React — перезагрузки
 * страницы нет нигде.
 */

export type Lang = "ru" | "uz";

type SiteState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  favorites: ReadonlySet<string>;
  toggleFavorite: (id: string) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
};

const Context = createContext<SiteState | null>(null);

export function SiteStateProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ru");
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const [compare, setCompare] = useState<string[]>([]);

  const value = useMemo<SiteState>(
    () => ({
      lang,
      setLang,
      favorites,
      toggleFavorite: (id) =>
        setFavorites((current) => {
          const next = new Set(current);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        }),
      compare,
      toggleCompare: (id) =>
        setCompare((current) =>
          current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-3),
        ),
      clearCompare: () => setCompare([]),
    }),
    [lang, favorites, compare],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSite(): SiteState {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useSite вне SiteStateProvider");
  return ctx;
}

/**
 * Узбекская версия — допник. Пока он выключен, язык всегда русский, даже
 * если в состоянии осталось «uz»: выключил тумблер — сайт вернулся.
 */
export function useLang(): Lang {
  const { lang } = useSite();
  const on = useAddon("uz");
  return on ? lang : "ru";
}

/**
 * Словарь интерфейса. Переведены наши подписи; тексты самой компании
 * (описания, FAQ) переведёт их команда — в панели у каждого поля два языка.
 */
const dict = {
  navCatalog: ["Каталог", "Katalog"],
  navFit: ["Подбор по размеру", "O‘lcham bo‘yicha"],
  navShowrooms: ["Шоурумы", "Shourumlar"],
  navFaq: ["Вопросы", "Savollar"],
  heroEyebrow: ["Мебельная фабрика · Ташкент · с 2007 года", "Mebel fabrikasi · Toshkent · 2007-yildan"],
  heroTitle: ["Доступная мебель без компромиссов", "Murosasiz hamyonbop mebel"],
  heroLead: [
    "Собственное производство, три шоурума в Ташкенте, бесплатная доставка и сборка. Рассрочка через Uzum и Anor — за 5 минут, без справок.",
    "O‘z ishlab chiqarishimiz, Toshkentda uchta shourum, bepul yetkazib berish va yig‘ish. Uzum va Anor orqali muddatli to‘lov — 5 daqiqada, ma’lumotnomasiz.",
  ],
  heroCta: ["Смотреть каталог", "Katalogni ko‘rish"],
  heroVisit: ["Приехать в шоурум", "Shourumga kelish"],
  lensHintPointer: ["Наведите: под тканью — сам диван", "Sichqonchani olib boring: mato ostida — divan"],
  lensHintTouch: ["Потяните линзу: под тканью — сам диван", "Linzani suring: mato ostida — divan"],
  catalogTitle: ["Каталог с ценами", "Narxlar bilan katalog"],
  perMonth: ["в месяц", "oyiga"],
  showroomsTitle: ["Три шоурума в Ташкенте", "Toshkentda uchta shourum"],
  faqTitle: ["Частые вопросы", "Ko‘p so‘raladigan savollar"],
  call: ["Позвонить", "Qo‘ng‘iroq qilish"],
} as const;

export type DictKey = keyof typeof dict;

export function useT() {
  const lang = useLang();
  return (key: DictKey) => dict[key][lang === "ru" ? 0 : 1];
}
