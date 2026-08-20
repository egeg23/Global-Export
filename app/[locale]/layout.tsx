import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { company } from "@/content/company";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, localeTags, locales, t, type Locale } from "@/lib/i18n";
import { alternates, organizationJsonLd, siteUrl } from "@/lib/seo";

import "../globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

export const viewport: Viewport = {
  themeColor: "#0f2b23",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.homeTitle,
      template: "%s — Global Export Company",
    },
    description: dict.meta.homeDescription,
    alternates: alternates(locale),
    icons: { icon: "/favicon.svg" },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const jsonLd = organizationJsonLd(locale, t(company.description, locale));

  return (
    <html lang={localeTags[locale]} className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest-800 focus:px-5 focus:py-3 focus:text-sm focus:text-sand-50"
        >
          {locale === "ru"
            ? "Перейти к содержимому"
            : locale === "uz"
              ? "Asosiy qismga o‘tish"
              : "Skip to content"}
        </a>

        <Header locale={locale} dict={dict} />
        {/* tabIndex makes the skip link actually move focus, not just scroll. */}
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer locale={locale} dict={dict} />

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
