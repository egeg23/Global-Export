"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/ui/container";
import { getDictionary } from "@/content/dictionaries";
import { defaultLocale, isLocale, localeHref } from "@/lib/i18n";

/**
 * Next renders not-found outside the route context, so the locale param is
 * unavailable here. Reading it from the path keeps a Russian visitor who hits
 * a dead link on a Russian page instead of dumping them into English.
 */
export default function NotFound() {
  const pathname = usePathname() ?? "";
  const segment = pathname.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <section className="flex min-h-[70vh] items-center bg-forest-950 pt-32">
      <Container className="py-20 text-center">
        <p className="font-display text-6xl text-harvest-300/70">404</p>
        <h1 className="mt-6 text-3xl text-sand-50 sm:text-4xl">{dict.notFound.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-sand-200/70">{dict.notFound.text}</p>
        <Link
          href={localeHref(locale)}
          className="mt-9 inline-flex h-12 items-center rounded-full bg-sand-50 px-8 text-[0.95rem] font-medium text-forest-900 transition-colors duration-300 hover:bg-white"
        >
          {dict.notFound.cta}
        </Link>
      </Container>
    </section>
  );
}
