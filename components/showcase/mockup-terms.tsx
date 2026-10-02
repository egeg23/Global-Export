import { isShowcase } from "@/lib/showcase";

/**
 * Строка в самом низу каждого проекта витрины: чей это макет и на каких
 * условиях им можно пользоваться.
 *
 * Решение владельца, 03.10.2026: ссылка на условия использования макетов —
 * на каждом макете, сделанном и будущем. Условия живут на devuz.studio
 * (`/{язык}/mockup-terms`): штраф 200% от заявленной клиенту стоимости, акцепт
 * — открытием макета и перепиской о нём. Без этой строки макет не сдаётся.
 *
 * Только на площадке: та же сборка на сервере заказчика — уже его сайт, и
 * строке про чужой макет там не место.
 *
 * Плавающие кнопки внизу (док конструктора, чат) строку не закрывают:
 * отступ под них — в globals.css, по `data-terms-line`.
 *
 * Стили — свои, а не из проекта: у каждого проекта свой фон, и строка должна
 * читаться и на светлом, и на тёмном. Серый #767c86 держит контраст около
 * 4.5 и на белом, и на почти чёрном.
 */
const TEXT = {
  ru: {
    rights: "Макет принадлежит DevUz Studio. Использовать его можно только по договору —",
    terms: "условия использования",
  },
  uz: {
    rights: "Maket DevUz Studio’ga tegishli. Undan faqat shartnoma asosida foydalanish mumkin —",
    terms: "foydalanish shartlari",
  },
  en: {
    rights: "This mock-up belongs to DevUz Studio and may be used only under a contract —",
    terms: "terms of use",
  },
} as const;

export type MockupTermsLocale = keyof typeof TEXT;

export const mockupTermsUrl = (locale: MockupTermsLocale) => `https://devuz.studio/${locale}/mockup-terms`;

export function MockupTerms({ locale = "ru" }: { locale?: MockupTermsLocale }) {
  if (!isShowcase) return null;
  const t = TEXT[locale];
  return (
    <p
      data-terms-line=""
      style={{
        margin: 0,
        padding: "14px 16px 18px",
        textAlign: "center",
        fontSize: 12,
        lineHeight: 1.5,
        color: "#767c86",
      }}
    >
      {t.rights}{" "}
      <a href={mockupTermsUrl(locale)} style={{ color: "inherit", textDecoration: "underline" }}>
        {t.terms}
      </a>
    </p>
  );
}
