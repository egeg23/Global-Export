import Link from "next/link";

import { Container } from "@/components/ui/container";
import { en } from "@/content/dictionaries/en";

/**
 * Rendered for unknown paths. It cannot read the locale param (Next renders
 * not-found outside the route context), so it uses the default dictionary and
 * links back to the English home page.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-forest-950 pt-32">
      <Container className="py-20 text-center">
        <p className="font-display text-6xl text-harvest-300/70">404</p>
        <h1 className="mt-6 text-3xl text-sand-50 sm:text-4xl">{en.notFound.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-sand-200/70">{en.notFound.text}</p>
        <Link
          href="/en"
          className="mt-9 inline-flex h-12 items-center rounded-full bg-sand-50 px-8 text-[0.95rem] font-medium text-forest-900 transition-colors duration-300 hover:bg-white"
        >
          {en.notFound.cta}
        </Link>
      </Container>
    </section>
  );
}
